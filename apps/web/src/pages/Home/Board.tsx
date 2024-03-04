import { ITaskJSON } from "@pro-manage/common-interfaces";

import { useSelector } from "react-redux";
import moment from "moment"

import Filter from "@web/components/HomePage/Board/Filter";
import { userInfoSelector } from "@web/store/slices/userInfoSlice";

import commonStyle from "./Index.module.css";
import styles from "./Board.module.css"
import Section, { ISectionprops } from "@web/components/HomePage/Board/Section";
import { taskSelector } from "@web/store/slices/taskSlice";
import { useEffect, useState } from "react";

const BoardPage = () => {

    const [backLogTasks, setBacklogTasks] = useState<ITaskJSON[]>([]);
    const [todoTasks, setToDoTasks] = useState<ITaskJSON[]>([]);
    const [inProgressTasks, setInProgressTasks] = useState<ITaskJSON[]>([]);
    const [doneTasks, setDoneTasks] = useState<ITaskJSON[]>([]);


    const { name } = useSelector(userInfoSelector)
    const tasks = useSelector(taskSelector);

    console.log(tasks)
    // "backlog", "in-progress", "to-do", "done"

    const sections: Required<ISectionprops>[] = [
        { title: "Backlog", tasks: backLogTasks },
        { title: "To do", tasks: todoTasks },
        { title: "In progress", tasks: inProgressTasks },
        { title: "Done", tasks: doneTasks }
    ]

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

                    {sections.map(s => (
                        <Section title={s.title} tasks={s.tasks} key={s.title} />
                    ))}

                </div>
            </div>

        </section>
    );
}

export default BoardPage;