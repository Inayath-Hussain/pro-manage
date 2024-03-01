import { useSelector } from "react-redux";
import moment from "moment"

import Filter from "@web/components/HomePage/Board/Filter";
import { userInfoSelector } from "@web/store/slices/userInfoSlice";

import commonStyle from "./Index.module.css";
import styles from "./Board.module.css"
import Section from "@web/components/HomePage/Board/Section";
import { ITask, taskSelector } from "@web/store/slices/taskSlice";
import { useEffect, useState } from "react";

const BoardPage = () => {

    const [backLogTasks, setBacklogTasks] = useState<ITask[]>([]);
    const [todoTasks, setToDoTasks] = useState<ITask[]>([]);
    const [inProgressTasks, setInProgressTasks] = useState<ITask[]>([]);
    const [doneTasks, setDoneTasks] = useState<ITask[]>([]);


    const { name } = useSelector(userInfoSelector)
    const tasks = useSelector(taskSelector);

    console.log(tasks)
    // "backlog", "in-progress", "to-do", "done"

    useEffect(() => {
        const backLogTasks = tasks.filter(t => t.status === "backlog")
        setBacklogTasks(backLogTasks)

        const todoTasks = tasks.filter(t => t.status === "to-do")
        setToDoTasks(todoTasks)

        const inProgressTasks = tasks.filter(t => t.status === "in-progress")
        setInProgressTasks(inProgressTasks)

        const doneTasks = tasks.filter(t => t.status === "done")
        setDoneTasks(doneTasks)

    }, [tasks])


    const todayDate = moment().format("Do MMM, YYYY")

    return (
        <section className={`${commonStyle.page_container} ${styles.board_page_container}`} >

            <div>

                {/* welcome text */}
                <h1 className={`${commonStyle.page_header} ${styles.welcome_text}`}>Welcome {name}</h1>

                {/* todays date */}
                <p className={styles.today_date}>{todayDate}</p>

                <div className={styles.header_and_filter_container}>
                    <p className={styles.board_page_header}>Board</p>

                    <Filter />
                </div>

            </div>


            {/* section container */}
            <div className={styles.tasks_sections_container_scroll}>

                <div className={styles.task_sections_container}>
                    <Section title="Backlog" tasks={backLogTasks} />

                    <Section title="To do" tasks={todoTasks} />

                    <Section title="In progress" tasks={inProgressTasks} />

                    <Section title="Done" tasks={doneTasks} />

                </div>
            </div>

        </section>
    );
}

export default BoardPage;