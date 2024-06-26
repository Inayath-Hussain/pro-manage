import { AddTaskMiddlewareError, priorityEnum, ITaskJSON, IChecklist, UpdateTaskMiddlewareError, InvalidTaskId } from "@pro-manage/common-interfaces";

import { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Id, toast } from "react-toastify";
import moment from "moment";
import z from "zod";
import PriorityInput from "@web/components/TaskForm/PriorityInput";
import ChecklistInput from "@web/components/TaskForm/ChecklistInput";
import FormError from "@web/components/UserPage/ErrorMsg";
import { useAbortController } from "@web/hooks/useAbortContoller";
import { routes } from "@web/routes";
import { NetworkError, UnauthorizedError } from "@web/services/api/errors";
import { addTaskService } from "@web/services/api/task/addTask";
import { updateTaskService } from "@web/services/api/task/updateTask";
import { addTaskAction, removeTaskAction, updateTaskAction } from "@web/store/slices/taskSlice";
import { errorToast } from "@web/utilities/toast/errorToast";
import { HandleChecklistItemChange } from "./TaskForm.interface";

import styles from "./TaskForm.module.css"


type IPriority = typeof priorityEnum[number]


interface Iprops {
    task?: ITaskJSON
    closeModal: () => void
}

const TaskFormModal: React.FC<Iprops> = ({ closeModal, task = undefined }) => {

    const formSchema = z.object({
        title: z.string().trim().min(1, { message: "title is required" }),
        priority: z.enum(priorityEnum),
        dueDate: z.string().optional(),
        checkList: z.array(z.object({
            description: z.string().min(1, { message: "description is required" }),
            done: z.boolean()
        })).nonempty({ message: "Should have atleast 1 check list item" })
    })

    type IForm = z.infer<typeof formSchema>

    const [formState, setFormState] = useState<Omit<IForm, "checkList">>({
        title: task ? task.title : "",
        priority: task ? task.priority : "moderate",
        dueDate: task ? task.dueDate : "",
        // "IForm" derived from zod validation enforces that checkList contains atleast 1 element. so used a separate state for easier use
    })

    const deepCopyChecklist = (checkList: IChecklist[]): IChecklist[] => checkList.map(c => ({ ...c }))

    const [checkList, setCheckList] = useState<IChecklist[]>(task ? deepCopyChecklist(task.checklist) : [])

    const dueDateRef = useRef<HTMLInputElement | null>(null);

    const [loading, setLoading] = useState(false);

    const { signalRef } = useAbortController();

    type IFormErrors = {
        [key in keyof Required<IForm>]: string
    }

    const [formErrors, setFormErrors] = useState<IFormErrors>({
        title: "",
        priority: "",
        dueDate: "",
        checkList: ""
    })

    const toastIdRef = useRef<Id>("");

    // hooks
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const preventClose = (e: React.MouseEvent<HTMLFormElement, MouseEvent>) => e.stopPropagation();



    // update title state
    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => setFormState({ ...formState, title: e.target.value })

    // update priority state
    const handlePriorityChange = (value: IPriority) => setFormState({ ...formState, priority: value })

    // update checkList state
    const addNewCheckList = () => {
        setCheckList([...checkList, { _id: Date.now().toString(), description: "", done: false }])
    }


    // opens date picker pop up
    const openDueDate = () => {
        dueDateRef.current?.showPicker()
    };

    // updates dueDate state
    const handleDueDateChange = (e: React.ChangeEvent<HTMLInputElement>) => setFormState({ ...formState, dueDate: e.target.value })


    // update one of the checklist object properties
    const handleChecklistItemChange: HandleChecklistItemChange = (itemId, detail) => {
        const newCheckList = [...checkList]
        const item = newCheckList.find(n => n._id === itemId)

        if (item === undefined) return console.log("item doesn't exist")

        switch (detail.key) {
            case ("description"):
                item.description = detail.value
                setCheckList(newCheckList)
                return


            case ("done"):
                item.done = detail.value
                setCheckList(newCheckList)
                return


            default:
                console.log("invalid key", detail)
        }
    }


    const removeChecklistItem = (itemId: string) => {
        const newCheckList = checkList.filter(c => c._id !== itemId)

        setCheckList(newCheckList)
    }


    const handleSubmit = async (e: React.FocusEvent<HTMLFormElement>) => {
        if (loading) return toast("Saving Task Please wait...", { type: "warning", autoClose: 5000 }) // saving task please wait toast here

        e.preventDefault();

        try {
            const { title, priority, dueDate } = formState
            setLoading(true)

            formSchema.parse({
                title,
                priority,
                dueDate,
                checkList
            })

            const checklistWithoutId = [...checkList]
            // @ts-ignore
            checklistWithoutId.forEach(c => { delete c._id })

            toastIdRef.current = toast.loading("Saving task")
            if (task === undefined) {
                const taskDoc = await addTaskService({ title, priority, checkList: checklistWithoutId, dueDate: dueDate || undefined }, signalRef.current.signal)
                if (taskDoc) {
                    toast.update(toastIdRef.current, { render: "Task saved", type: "success", autoClose: 5000 })
                    // dispatch action to add task
                    dispatch(addTaskAction(taskDoc))
                }
            }

            else {
                // updateTaskService
                const taskDoc = await updateTaskService({ title, priority, checkList: checklistWithoutId, taskId: task._id, dueDate: dueDate || undefined }, signalRef.current.signal)

                if (taskDoc) {
                    toast.update(toastIdRef.current, { render: "Task saved", type: "success", autoClose: 5000 })
                    // dispatch action to update task
                    dispatch(updateTaskAction({ currentStatus: task.status, task: taskDoc }))
                }
            }

            setFormErrors({ title: "", dueDate: "", checkList: "", priority: "" })
            setLoading(false);
            closeModal();
            // close modal
        }
        catch (ex) {

            switch (true) {
                case (ex instanceof z.ZodError):
                    const { title, priority, dueDate, checkList } = ex.formErrors.fieldErrors
                    return setFormErrors({
                        title: title ? title[0] : "",
                        priority: priority ? priority[0] : "",
                        dueDate: dueDate ? dueDate[0] : "",
                        checkList: checkList ? checkList[0] : ""
                    })


                case (ex instanceof UnauthorizedError):
                    navigate(routes.user.login)
                    closeModal();
                    errorToast(toastIdRef.current, ex.message)
                    return


                case (ex instanceof AddTaskMiddlewareError || ex instanceof UpdateTaskMiddlewareError):
                    errorToast(toastIdRef.current, ex.message)
                    return setFormErrors({
                        title: ex.errors.title || "",
                        priority: ex.errors.priority || "",
                        dueDate: ex.errors.dueDate || "",
                        checkList: ex.errors.checkList || ""
                    })


                // when editing a task if the task doesn't exist in server
                case (ex instanceof InvalidTaskId):
                    dispatch(removeTaskAction({ status: task?.status as ITaskJSON["status"], _id: task?._id as string }))
                    closeModal()
                    errorToast(toastIdRef.current, ex.message)

                    return


                case (ex instanceof NetworkError):
                    errorToast(toastIdRef.current, ex.message)
                    return


                default:
                    errorToast(toastIdRef.current, "Something went wrong try again later")
                    return
            }

            // check if serivce threw errors
            // default Please try again later toast
        }
    }


    const formatDueDate = (date: string) => moment(date).format("MM/DD/YYYY")

    return (
        <form className={styles.form} onClick={preventClose} onSubmit={handleSubmit}>

            {/* title input */}
            <label className={styles.label} htmlFor="title">
                <p>Title <span>*</span></p>

                <FormError className={styles.form_error} message={formErrors.title} />

            </label>
            <input className={styles.title_input} id="title" type="text" name="title" placeholder="Enter Task Title"
                value={formState.title} onChange={handleTitleChange} required />


            {/* priority input */}
            <PriorityInput selectedPriority={formState.priority} onChange={handlePriorityChange} />


            {/* checkList */}
            <ChecklistInput checkList={checkList}
                errorMsg={formErrors.checkList}
                addNewCheckList={addNewCheckList} removeCheckList={removeChecklistItem}
                handleChecklistItemChange={handleChecklistItemChange}
            />



            <div className={styles.dueDate_and_buttons_container}>

                <label className={`${styles.button} ${styles.dueDate_label}`} htmlFor="dueDate"
                    onClick={openDueDate} >

                    {/* display text */}
                    {formState.dueDate ? formatDueDate(formState.dueDate) : "Select Due Date"}

                    {/* date input */}
                    <input type="date" className={styles.dueDate} id="dueDate" ref={dueDateRef}
                        onChange={handleDueDateChange} tabIndex={-10} value={formState.dueDate} />

                </label>


                <div className={styles.buttons_container} >
                    <button type="button" className={`${styles.button} ${styles.cancel_button}`} onClick={closeModal}>Cancel</button>

                    <button type="submit" className={`${styles.button} ${styles.save_button}`}>Save</button>
                </div>

            </div>

        </form>
    );
}

export default TaskFormModal;