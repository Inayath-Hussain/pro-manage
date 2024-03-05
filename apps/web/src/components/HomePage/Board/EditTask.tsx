import { ITaskJSON } from "@pro-manage/common-interfaces";
import TaskFormModal from "@web/components/modal/contents/TaskForm";
import useModal from "@web/hooks/useModal";

interface Iprops {
    task: ITaskJSON
    closeOption: () => void
}

const EditTask: React.FC<Iprops> = ({ task, closeOption }) => {

    const { showModal, hideModal, ModalPortal } = useModal();

    const close = () => {
        closeOption();
        hideModal();
    }

    return (
        <>
            <option onClick={showModal} title="Edit task">
                Edit
            </option>

            {ModalPortal(<TaskFormModal closeModal={close} task={task} />)}
        </>
    );
}

export default EditTask;