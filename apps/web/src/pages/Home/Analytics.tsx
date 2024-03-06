import { IAnalytics } from "@pro-manage/common-interfaces";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAbortController } from "@web/hooks/useAbortContoller";
import { NetworkError, UnauthorizedError } from "@web/services/api/errors";
import { getAnalyticsService } from "@web/services/api/task/getAnalytics";

import commonStyle from "./Index.module.css"
import styles from "./Analytics.module.css";
import { routes } from "@web/routes";
import { useOnline } from "@web/hooks/useOnline";

const AnalyticsPage = () => {


    const [analytics, setAnalytics] = useState<IAnalytics | null>(null)
    const [error, setError] = useState("");


    const navigate = useNavigate();

    const { signalRef } = useAbortController();
    const { isOnline } = useOnline();

    useEffect(() => {
        const call = async () => {
            if (!isOnline) {
                // connect to a network and try again toast
                return setError("You are offline")
            }

            try {
                const result = await getAnalyticsService(signalRef.current.signal)

                setAnalytics(result)
                setError("")
            }
            catch (ex) {
                switch (true) {
                    case (ex instanceof NetworkError):
                        // Check your network and try again toast
                        setError(ex.message)
                        break

                    case (ex instanceof UnauthorizedError):
                        navigate(routes.user.login)
                        break;

                    default:
                        // Please try again later toast
                        setError(ex as string)
                        break;
                }
            }

        }

        call();

    }, [])


    interface IList {
        description: string
        value: number
    }

    const firstList: IList[] = [
        { description: "Backlog Tasks", value: analytics?.backlog || 0 },
        { description: "To-do Tasks", value: analytics?.todo || 0 },
        { description: "In-Progress Tasks", value: analytics?.progress || 0 },
        { description: "Completed Tasks", value: analytics?.done || 0 }
    ]

    const secondList: IList[] = [
        { description: "Low Priority", value: analytics?.low || 0 },
        { description: "Moderate Priority", value: analytics?.moderate || 0 },
        { description: "High Priority", value: analytics?.high || 0 },
        { description: "Due Date Tasks", value: analytics?.dueDate || 0 },

    ]

    return (
        <section className={commonStyle.page_container}>
            <h1 className={commonStyle.page_header}>Analytics</h1>

            <div className={styles.lists_layout}>

                {analytics === null ? <h1>{error ? error : "Please wait loading..."}</h1> :

                    <>
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
                    </>
                }


            </div>

        </section>
    );
}

export default AnalyticsPage;