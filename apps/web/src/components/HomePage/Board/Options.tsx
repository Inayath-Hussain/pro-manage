import { InvalidTaskId } from "@pro-manage/common-interfaces";

import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import DotsIcon from "@web/assets/icons/dots.svg"
import ConfirmModalComponent from "@web/components/modal/contents/Confirm";
import { useAbortController } from "@web/hooks/useAbortContoller";
import useModal from "@web/hooks/useModal";
import { useOnline } from "@web/hooks/useOnline";
import { routes } from "@web/routes";
import { NetworkError, UnauthorizedError } from "@web/services/api/errors";
import { deleteTaskService } from "@web/services/api/task/deleteTask";
import { removeTask } from "@web/store/slices/taskSlice";

import styles from "./Options.module.css"


interface Iprops {
    taskId: string
}

const Options: React.FC<Iprops> = ({ taskId }) => {

    const [open, setOpen] = useState(false);
    // used to keep track of whether the request is still pending
    const [loading, setLoading] = useState(false);

    const containerRef = useRef<HTMLDivElement | null>(null);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { signalRef, renewController } = useAbortController();
    const { showModal, hideModal, ModalPortal, showModalState } = useModal();
    const { isOnline } = useOnline();


    // close options when clicked outside of it
    useEffect(() => {
        const closeOptions = (e: MouseEvent) => {
            // if user clicks outside of options container then closes the options
            if (containerRef.current && !e.composedPath().includes(containerRef.current)) setOpen(false)
        }
        document.addEventListener("click", closeOptions)
        return () => {
            document.removeEventListener("click", closeOptions)
        }
    }, [])


    // trigger abort when modal is closed
    useEffect(() => {
        if (showModalState === false) {
            signalRef.current.abort()
            renewController();
            setLoading(false);
        }
    }, [showModalState])


    const handleOpen = () => {
        setOpen(!open)
    }


    const handleDelete = async () => {

        if (!isOnline) return // Connect to network and try again toast here

        // prevent from making request when a previous delete request is still pending
        if (loading) return

        try {
            await deleteTaskService(taskId, signalRef.current.signal)

            hideModal();
            dispatch(removeTask({ _id: taskId }))
        }
        catch (ex) {
            switch (true) {
                case (ex instanceof UnauthorizedError):
                    navigate(routes.user.login);
                    hideModal();
                    break;


                case (ex instanceof InvalidTaskId):
                    hideModal();
                    dispatch(removeTask({ _id: taskId }))
                    break;

                case (ex instanceof NetworkError):
                    // Check network and try again toast here
                    hideModal();
                    break;
            }
        }
        setOpen(false)
    }


    interface Ioptions {
        displayText: string
        onClick: () => void
    }

    const options: Ioptions[] = [
        { displayText: "Edit", onClick: () => { } },
        { displayText: "Share", onClick: () => { } },
        { displayText: "Delete", onClick: showModal }
    ]


    return (
        <>
            <div className={styles.options_container} ref={containerRef}>
                <button className={styles.options_button} onClick={handleOpen}>
                    <img src={DotsIcon} alt="" />
                </button>

                {/* options */}
                {open && <div className={styles.options}>

                    {options.map(o => (
                        <option onClick={o.onClick} key={o.displayText}>
                            {o.displayText}
                        </option>
                    ))}

                </div>}


            </div>
            {ModalPortal(<ConfirmModalComponent action="Delete" handleConfirm={handleDelete} disabled={loading} />)}
        </>
    );
}

export default Options;