import { IAnalytics } from "@pro-manage/common-interfaces";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAbortController } from "@web/hooks/useAbortContoller";
import { useOnline } from "@web/hooks/useOnline";
import { routes } from "@web/routes";
import { NetworkError, UnauthorizedError } from "@web/services/api/errors";
import { getAnalyticsService } from "@web/services/api/task/getAnalytics";

import commonStyle from "./Index.module.css"
import styles from "./Analytics.module.css";

const AnalyticsPage = () => {


    const [analytics, setAnalytics] = useState<IAnalytics | null>(null)
    const [error, setError] = useState("");


    const navigate = useNavigate();

    const { signalRef } = useAbortController();
    const { isOnline } = useOnline();

    useEffect(() => {
        const call = async () => {
            if (!isOnline) {
                toast("Connect to a network and try again")
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
                        toast(ex.message, { autoClose: 5000, type: "error" })
                        setError(ex.message)
                        break

                    case (ex instanceof UnauthorizedError):
                        toast(ex.message, { autoClose: 5000, type: "error" })
                        navigate(routes.user.login)
                        break;

                    default:
                        toast("Something went wrong. Please try again later", { autoClose: 5000, type: "error" })
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