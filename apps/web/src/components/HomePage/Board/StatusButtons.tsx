import { InvalidTaskId, statusEnum } from "@pro-manage/common-interfaces"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAbortController } from "@web/hooks/useAbortContoller"
import { updateTaskStatusService } from "@web/services/api/task/updateTaskStatus"
import { NetworkError, UnauthorizedError } from "@web/services/api/errors"

import styles from "./StatusButtons.module.css"
import { routes } from "@web/routes"
import { useDispatch } from "react-redux"
import { updateTaskStatusAction } from "@web/store/slices/taskSlice"

interface Iprops {
    taskId: string
    status: typeof statusEnum[number]
}

const StatusButtons: React.FC<Iprops> = ({ status, taskId }) => {

    const { signalRef } = useAbortController()

    const navigate = useNavigate()
    const dispatch = useDispatch()

    // used to track if a request is in progress
    const [loading, setLoading] = useState(false);

    const handleChangeStatus = async (status: Iprops['status']) => {

        if (loading === true) return console.log("status buttons toast") //toast here

        // make service call to update status
        try {

            setLoading(true)
            const result = await updateTaskStatusService({ status, taskId }, signalRef.current.signal)

            if (result) {
                setLoading(false)

                dispatch(updateTaskStatusAction({ _id: taskId, status }))
                // on success dispatch action to update task
            }
        }
        catch (ex) {
            setLoading(false)
            switch (true) {
                case (ex instanceof NetworkError):
                    console.log("network error toast", ex.message)
                    break;

                case (ex instanceof InvalidTaskId):
                    console.log("task donot exist toast", ex.message)
                    break;

                case (ex instanceof UnauthorizedError):
                    navigate(routes.user.login)
                    return

                default:
                    console.log(ex)
            }
        }
    }




    interface IStatusTexts {
        displayText: string
        status: Iprops["status"]
    }

    const buttonsData: IStatusTexts[] = [
        { displayText: "BACKLOG", status: "backlog" },
        { displayText: "TO DO", status: "to-do" },
        { displayText: "PROGRESS", status: "in-progress" },
        { displayText: 'DONE', status: "done" }
    ]


    switch (status) {
        case ("backlog"):
            buttonsData.splice(0, 1)
            break;

        case ("to-do"):
            buttonsData.splice(1, 1)
            break;

        case ("in-progress"):
            buttonsData.splice(2, 1)
            break;

        case ("done"):
            buttonsData.splice(3, 1)
            break;
    }


    return (
        <div className={styles.status_button_container}>

            {buttonsData.map(b => (

                <button className={styles.status_button} onClick={() => handleChangeStatus(b.status)} key={b.status}>
                    {b.displayText}
                </button>

            ))}

        </div>
    );
}

export default StatusButtons;