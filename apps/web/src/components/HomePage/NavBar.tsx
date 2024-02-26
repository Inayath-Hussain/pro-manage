import { Link, useLocation, useNavigate } from "react-router-dom";

import Logo from "@web/assets/icons/pro-manage-logo.svg"
import LogoutIcon from '@web/assets/icons/Logout.svg'
import { routes } from "@web/routes";

import AnalyticsIcon from "../Icons/Analytics";
import BoardIcon from "../Icons/Board";
import SettingsIcon from "../Icons/Settings";
import { IIconProps } from "../Icons/interface";

import styles from "./NavBar.module.css"
import { useAbortController } from "@web/hooks/useAbortContoller";
import { logoutService } from "@web/services/api/logoutService";
import { useOnline } from "@web/hooks/useOnline";


const NavBar = () => {

    const { pathname } = useLocation();
    const navigate = useNavigate();

    const { signalRef } = useAbortController();
    const { isOnline } = useOnline();


    /**
     * to check if current url is same as the one provided in arguments
     */
    const isActiveLink = (path: string) => {
        if (pathname === path) return true
        return false
    }


    const handleLogout = async () => {
        try {
            await logoutService(signalRef.current.signal)

            navigate(routes.user.login)
        }
        catch (ex) {
            // toast message here to try again later
        }
    }



    interface ILinks {
        IconComponent: React.FC<IIconProps>
        text: string
        route: string
    }

    const links: ILinks[] = [
        { IconComponent: BoardIcon, route: routes.home, text: "Board" },
        { IconComponent: AnalyticsIcon, route: routes.analytics, text: "Analytics" },
        { IconComponent: SettingsIcon, route: routes.settings, text: "Settings" }
    ]


    return (

        <section className={styles.nav_container} >

            <div className={`${styles.header_container} ${styles.flex}`} >
                <img src={Logo} alt="" className={styles.logo} />

                <h3 className={styles.header}>Pro Manage</h3>
            </div>


            <nav>
                {links.map(l => (

                    <Link to={l.route} title={l.text} key={l.route}
                        className={`${styles.link} ${styles.flex} ${isActiveLink(l.route) ? styles.active_link : ""}`} >

                        <l.IconComponent className={styles.logo} />
                        <p className={styles.link_text}>{l.text}</p>

                    </Link>

                ))}
            </nav>




            <button onClick={handleLogout} className={`${styles.logout_button} ${styles.flex}`}
                disabled={!isOnline} >
                <img src={LogoutIcon} alt="" className={styles.logo} />
                <p>Log out</p>
            </button>

        </section>
    );
}

export default NavBar;