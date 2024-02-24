import { Outlet } from "react-router-dom";
import NavBar from "@web/components/HomePage/NavBar";
import styles from "./Home.module.css"

const HomePage = () => {


    return (
        <main className={styles.home_layout}>
            <NavBar />
            <Outlet />
        </main>
    );
}

export default HomePage;