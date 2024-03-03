import { useState } from "react";

import CollapseAll from "@web/assets/icons/collapse-all.svg";
import AddIcon from "@web/assets/icons/add_logo.svg";
import { ITask } from "@web/store/slices/taskSlice";
import Card from "./Card";

import styles from "./Section.module.css";

export interface ISectionprops {
    title: string
    tasks: ITask[]
}



const Section: React.FC<ISectionprops> = ({ title, tasks }) => {

    // this state is passed to all cards and whenever this state changes card collapse function is run
    const [collapseAll, setCollapseAll] = useState(false);

    const handleCollapseAll = () => {
        setCollapseAll(!collapseAll)
    }


    const handleAddNewTask = () => {

    }

    return (
        <section className={styles.section}>

            <div className={styles.section_header}>
                <p>{title}</p>

                <div className={styles.buttons_container}>

                    {/* Add Task */}
                    {title === "To do" &&
                        <button className={styles.add_task_button} aria-label="Add Task" title="Add Task"
                            onClick={handleAddNewTask}>
                            <img src={AddIcon} alt="" />
                        </button>}


                    {/* Collapse All */}
                    <button className={styles.collapse_all_buttton} aria-label="collapse all" title="collapse all"
                        onClick={handleCollapseAll}>
                        <img src={CollapseAll} alt="" />
                    </button>

                </div>

            </div>


            <div className={styles.cards_container}>

                {tasks.map(t => (
                    <Card task={t} key={t.title} collapseAll={collapseAll} />
                ))}

                {/* <Card />
                <Card /> */}
            </div>

        </section>
    );
}

export default Section;