import CollapseAll from "@web/assets/icons/collapse-all.svg"
import { ITask } from "@web/store/slices/taskSlice";
import Card from "./Card";

import styles from "./Section.module.css"
import { useState } from "react";


interface Iprops {
    title: string
    tasks: ITask[]
}



const Section: React.FC<Iprops> = ({ title, tasks }) => {

    // this state is passed to all cards and whenever this state changes card collapse function is run
    const [collapseAll, setCollapseAll] = useState(false);

    const handleCollapseAll = () => {
        setCollapseAll(!collapseAll)
    }

    return (
        <section className={styles.section}>

            <div className={styles.section_header}>
                <p>{title}</p>

                <button className={styles.collapse_all_buttton} aria-label="collapse all" title="collapse all"
                    onClick={handleCollapseAll}>
                    <img src={CollapseAll} alt="" />
                </button>
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