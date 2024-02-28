import commonStyle from "./Index.module.css"
import styles from "./Analytics.module.css";

const AnalyticsPage = () => {

    interface IList {
        description: string
        value: number
    }

    const firstList: IList[] = [
        { description: "Backlog Tasks", value: 0 },
        { description: "To-do Tasks", value: 0 },
        { description: "In-Progress Tasks", value: 0 },
        { description: "Completed Tasks", value: 0 }
    ]

    const secondList: IList[] = [
        { description: "Low Priority", value: 0 },
        { description: "Moderate Priority", value: 0 },
        { description: "High Priority", value: 0 },
        { description: "Due Date Tasks", value: 0 },

    ]

    return (
        <section className={commonStyle.page_container}>
            <h1 className={commonStyle.page_header}>Analytics</h1>

            <div className={styles.lists_layout}>

                <ul className={styles.list}>

                    {firstList.map(item => (

                        <li className={styles.list_item} key={item.description}>
                            <div className={styles.flex}>
                                <p>{item.description}</p>    <p>{item.value}</p>
                            </div>
                        </li>

                    ))}

                </ul>


                <ul className={styles.list}>

                    {secondList.map(item => (

                        <li className={styles.list_item} key={item.description}>
                            <div className={styles.flex}>
                                <p>{item.description}</p>    <p>{item.value}</p>
                            </div>
                        </li>

                    ))}

                </ul>

            </div>

        </section>
    );
}

export default AnalyticsPage;