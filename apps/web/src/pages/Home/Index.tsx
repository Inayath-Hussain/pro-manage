import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom";

import NavBar from "@web/components/HomePage/NavBar";
import { useAbortController } from "@web/hooks/useAbortContoller";
import { AppDispatch } from "@web/store";
import { getUserInfo, userInfoSelector } from "@web/store/slices/userInfoSlice";
import { renewTask } from "@web/store/slices/taskSlice"

import { routes } from "@web/routes";
import { getTaskService } from "@web/services/api/task/getTask";

import styles from "./Index.module.css";
import { NetworkError, UnauthorizedError } from "@web/services/api/errors";


const HomePage = () => {

    const navigate = useNavigate();
    // retrieve user info
    const userInfo = useSelector(userInfoSelector)
    const dispatch = useDispatch<AppDispatch>();

    const { signalRef } = useAbortController();

    // for userInfo
    useEffect(() => {
        const call = async () => {
            if (userInfo.status === "idle" || userInfo.status === "error") {
                // get user info
                dispatch(getUserInfo(signalRef.current.signal)).unwrap().catch((reason) => {
                    switch (true) {
                        case (reason instanceof UnauthorizedError):
                            return navigate(routes.user.login);

                        case (reason instanceof NetworkError):
                            return console.log("Check your network and try again") // Check your network and try again toast here
                    }
                })
            }
        }

        call()
    }, [])


    // get all user's tasks
    useEffect(() => {
        const call = async () => {
            try {
                const result = await getTaskService("week", signalRef.current.signal)

                dispatch(renewTask(result))
            }
            catch (ex) {
                console.log(ex)

                if (ex === false) navigate(routes.user.login)
            }


        }

        call()
    }, [])

    return (
        <main className={styles.home_layout}>
            <NavBar />
            <Outlet />
        </main>
    );
}

export default HomePage;