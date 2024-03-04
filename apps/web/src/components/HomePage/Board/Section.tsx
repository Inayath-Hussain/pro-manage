import { ITaskJSON } from "@pro-manage/common-interfaces";
import { useState } from "react";

import CollapseAll from "@web/assets/icons/collapse-all.svg";
import Card from "./Card";

import styles from "./Section.module.css";
// import useModal from "@web/hooks/useModal";
// import TaskFormModal from "@web/components/modal/contents/TaskForm";
import AddTask from "./AddTask";

export interface ISectionprops {
    title: string
    tasks: ITaskJSON[]
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
                    {title === "To do" && <AddTask />}


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

            </div>

            {/* appends modal to dom */}
            {/* {ModalPortal(<TaskFormModal />)} */}
        </section>
    );
}

export default Section;