import { ITaskJSON } from "@pro-manage/common-interfaces";
import TaskFormModal from "@web/components/modal/contents/TaskForm";
import useModal from "@web/hooks/useModal";

interface Iprops {
    task: ITaskJSON
}

const EditTask: React.FC<Iprops> = ({ task }) => {

    const { showModal, hideModal, ModalPortal } = useModal();

    return (
        <>
            <option onClick={showModal}>
                Edit
            </option>

            {ModalPortal(<TaskFormModal closeModal={hideModal} task={task} />)}
        </>
    );
}

export default EditTask;