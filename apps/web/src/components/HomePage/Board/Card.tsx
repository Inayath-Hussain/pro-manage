import { InvalidCheckListItemId, InvalidTaskId } from "@pro-manage/common-interfaces";

import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import CheckListArror from "@web/assets/icons/checkList-arrow.svg"
import { useAbortController } from "@web/hooks/useAbortContoller";
import { routes } from "@web/routes";
import { NetworkError } from "@web/services/api/errors";
import { updateDoneService } from "@web/services/api/task/updateDone";
import { ITask, removeCheckListItemAction, removeTaskAction, updateDoneAction } from "@web/store/slices/taskSlice";
import Options from "./Options";
import StatusButtons from "./StatusButtons";

import styles from "./Card.module.css"


interface Iprops {
    task: ITask
    collapseAll: boolean
}

const Card: React.FC<Iprops> = ({ task, collapseAll }) => {

    // state used to display or hide checkList items
    const [open, setOpen] = useState(false);

    // state to keep track of whether the api call is finished or not
    const [loading, setLoading] = useState(false);


    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { signalRef } = useAbortController();

    // when collapse all is triggered close the card
    useEffect(() => {
        setOpen(false)
    }, [collapseAll])

    const handleOpen = () => {
        setOpen(!open)
    }

    // update done of checklist item
    const handleDoneChange = async (checkListId: string) => {
        // if loading return
        if (loading) return console.log("updating task item please wait toast here")   // updating task item please wait toast here


        // make service call
        const item = task.checklist.find(item => item._id === checkListId)
        if (item === undefined) return // dispatch to remove item

        try {
            setLoading(true)
            const result = await updateDoneService({ taskId: task._id, checkListId, done: !item.done }, signalRef.current.signal)

            if (result) {
                setLoading(false)
                // dispatch action to update checkList item
                dispatch(updateDoneAction({ taskId: task._id, checkListId, done: !item.done }))

            }
        }
        catch (ex) {
            setLoading(false)
            switch (true) {
                case (ex === false):
                    return navigate(routes.user.login)

                case (ex instanceof InvalidTaskId):
                    dispatch(removeTaskAction({ _id: task._id }))
                    return

                case (ex instanceof InvalidCheckListItemId):
                    // dispatch to remove item from checkList
                    dispatch(removeCheckListItemAction({ taskId: task._id, itemID: checkListId }))
                    return

                case (ex instanceof NetworkError):
                    // Check network and try again later, toast here
                    return

                default:
                    console.log(ex)
            }
        }
    }




    // get css classes for priority dot color
    const getPriorityColor = () => {
        if (task.priority === "low") return styles.priority_dot_green
        if (task.priority === "moderate") return styles.priority_dot_blue
        if (task.priority === "high") return styles.priority_dot_red
    }

    // get total checkList items whose done property is true 
    const getTotalDoneItems = () => {
        return task.checklist.reduce((prev, curr) => {
            if (curr.done) return prev + 1
            return prev
        }, 0)
    }

    const getFormattedDueDate = (date: string) => moment(date).format("MMM Do");

    // check if due date is passed
    const hasDueDatePassed = (date: string) => moment(date).isBefore(new Date(), "day")


    // returns module css class for dueDate 
    const getDueDateClass = (dueDate: string) =>
        task.status === "done" ? styles.dueDate_for_task_done :
            hasDueDatePassed(dueDate) ? styles.dueDate_passed : ""

    return (
        <div className={styles.card}>

            {/* priority and options */}
            <div className={styles.priority_and_options_container}>

                <div className={styles.priority}>
                    {/* check priority and add color */}
                    <div className={`${styles.priority_dot} ${getPriorityColor()}`} />

                    {task.priority} Priority
                </div>

                <Options taskId={task._id} />
            </div>



            {/* heading */}
            <h2 className={styles.task_title}>{task.title}</h2>



            {/* CheckList */}
            <div className={styles.checkList_container}>

                {/* checklist outer */}
                <div className={styles.checklist_outer}>
                    <p className={styles.total_done}>Checklist ({getTotalDoneItems()} / {task.checklist.length})</p>

                    <button className={styles.checklist_collapse_button} onClick={handleOpen}>
                        <img src={CheckListArror} alt="" className={`${styles.arrow} ${open ? styles.arrow_up : ""}`} />
                    </button>
                </div>

                {/* checklist_innner */}
                <div className={styles.checklist_inner}>


                    {/* items */}

                    {open && task.checklist.map(c => (
                        <div className={styles.item} key={c._id}>
                            <input type="checkbox" checked={c.done} onChange={() => handleDoneChange(c._id)} />

                            <p>{c.description}</p>
                        </div>

                    ))}

                </div>


                {/* dueDate and status */}
                <div className={styles.dueDate_and_status}>

                    {/* check if dueDate has passed and set color to red  */}
                    <div>
                        {task.dueDate &&
                            <p className={`${styles.dueDate} ${getDueDateClass(task.dueDate)}`}>
                                {getFormattedDueDate(task.dueDate)}
                            </p>
                        }
                    </div>


                    {/* status */}
                    <StatusButtons taskId={task._id} status={task.status} />

                </div>

            </div>

        </div>
    );
}

export default Card;