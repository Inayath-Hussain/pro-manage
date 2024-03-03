import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useAbortController } from "@web/hooks/useAbortContoller";
import useModal from "@web/hooks/useModal";
import { routes } from "@web/routes";
import { logoutService } from "@web/services/api/user/logoutService";
import { NetworkError } from "@web/services/api/errors";
import { clearUserInfo } from "@web/store/slices/userInfoSlice";

import styles from "./Logout.module.css"


const LogoutModalComponent = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { hideModal } = useModal();
    const { signalRef } = useAbortController();

    const preventClose = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        e.stopPropagation();
    }

    const handleLogout = async () => {
        try {
            await logoutService(signalRef.current.signal)

            dispatch(clearUserInfo())
            navigate(routes.user.login)
            hideModal();
        }
        catch (ex) {
            if (ex instanceof NetworkError) return  //Check your network and try again toast here

            // Something went wrong toast here
        }
    }

    return (
        <div className={styles.logout_container} onClick={preventClose}>
            <p className={styles.logout_text}>Are you sure you want to Logout?</p>

            <button className={`${styles.button} ${styles.confirm_button}`} onClick={handleLogout}>Yes, Logout</button>
            <button className={`${styles.button} ${styles.cancel_button}`} onClick={hideModal}>Cancel</button>
        </div>
    );
}

export default LogoutModalComponent;