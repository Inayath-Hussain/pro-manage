import moment from "moment";
import CheckListArror from "@web/assets/icons/checkList-arrow.svg"
import Options from "./Options";
import { ITask } from "@web/store/slices/taskSlice";

import styles from "./Card.module.css"
import { useEffect, useState } from "react";


interface Iprops {
    task: ITask
    collapseAll: boolean
}

const Card: React.FC<Iprops> = ({ task, collapseAll }) => {

    const [open, setOpen] = useState(false);

    useEffect(() => {

        setOpen(false)

    }, [collapseAll])

    const handleOpen = () => {
        setOpen(!open)
    }

    const getPriorityColor = () => {
        if (task.priority === "low") return styles.priority_dot_green
        if (task.priority === "moderate") return styles.priority_dot_blue
        if (task.priority === "high") return styles.priority_dot_red
    }

    const getTotalDoneItems = () => {
        return task.checklist.reduce((prev, curr) => {
            if (curr.done) return prev + 1
            return prev
        }, 0)
    }

    const getFormattedDueDate = (date: string) => moment(date).format("MMM Do")

    return (
        <div className={styles.card}>

            {/* priority and options */}
            <div className={styles.priority_and_options_container}>

                <div className={styles.priority}>
                    {/* check priority and add color */}
                    <div className={`${styles.priority_dot} ${getPriorityColor()}`} />

                    {task.priority} Priority
                </div>

                <Options />
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
                        <>
                            <div className={styles.item}>
                                <input type="checkbox" checked={c.done} />

                                <p>{c.description}</p>
                            </div>


                            <div className={styles.item}>
                                <input type="checkbox" checked={c.done} />

                                <p>{c.description}</p>
                            </div>
                        </>

                    ))}

                </div>


                {/* dueDate and status */}
                <div className={styles.dueDate_and_status}>

                    {/* check if dueDate has passed and set color to red  */}
                    {task.dueDate ?
                        <p className={styles.dueDate}>{getFormattedDueDate(task.dueDate)}</p>
                        :
                        <p></p>
                    }


                    {/* status */}
                    <div className={styles.status_container}>
                        <button className={styles.status}>
                            PROGRESS
                        </button>

                        <button className={styles.status}>
                            TO DO
                        </button>

                        <button className={styles.status}>
                            DONE
                        </button>
                    </div>

                </div>

            </div>

        </div>
    );
}

export default Card;