import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom";

import NavBar from "@web/components/HomePage/NavBar";
import { useAbortController } from "@web/hooks/useAbortContoller";
import { AppDispatch } from "@web/store";
import { getUserInfo, userInfoSelector } from "@web/store/slices/userInfoSlice";

import styles from "./Index.module.css";
import { routes } from "@web/routes";


const HomePage = () => {

    const navigate = useNavigate();
    // retrieve user info
    const userInfo = useSelector(userInfoSelector)
    const dispatch = useDispatch<AppDispatch>();

    const { signalRef } = useAbortController();

    useEffect(() => {
        const call = async () => {
            if (userInfo.status === "idle") {
                // get user info
                dispatch(getUserInfo(signalRef.current.signal)).unwrap().catch((reason) => {
                    if (reason === 401) navigate(routes.user.login)
                })
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