import DotsIcon from "@web/assets/icons/dots.svg"
import styles from "./Options.module.css"
import { useEffect, useRef, useState } from "react";

const Options = () => {

    const [open, setOpen] = useState(false);

    const containerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const closeOptions = (e: MouseEvent) => {
            // if user clicks outside of options container then closes the options
            if (containerRef.current && !e.composedPath().includes(containerRef.current)) setOpen(false)
        }

        document.addEventListener("click", closeOptions)

        return () => {
            document.removeEventListener("click", closeOptions)
        }
    }, [])


    const handleOpen = () => {
        setOpen(!open)
    }

    return (
        <div className={styles.options_container} ref={containerRef}>
            <button className={styles.options_button} onClick={handleOpen}>
                <img src={DotsIcon} alt="" />
            </button>

            {/* options */}
            {open && <div className={styles.options}>

                <option>
                    Edit
                </option>

                <option>
                    Share
                </option>

                <option>
                    Delete
                </option>
            </div>}

        </div>
    );
}

export default Options;