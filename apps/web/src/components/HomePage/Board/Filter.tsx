import ArrowIcon from "@web/assets/icons/down-arrow.svg"
import styles from "./Filter.module.css"
import { useState } from "react"

interface Iprops {
}

const Filter: React.FC<Iprops> = () => {

    // here, 0 - today, 1 - this week, 2 - this month
    const [selectedFilter, setSelectedFilter] = useState(1);
    const options = ["Today", "This Week", "This Month"]

    const [open, setOpen] = useState(false);

    const handleOpen = () => {
        setOpen(!open)
    }


    const handleFilterChange = (value: number) => {

        // make call

        // get data 

        // and then change selectedFilter
        setSelectedFilter(value)
    }

    return (
        <>

            <div className={styles.filter_container} onClick={handleOpen}>
                {options[selectedFilter]}

                <img src={ArrowIcon} alt="" />



                {open &&
                    <div className={styles.options_container}>


                        {options.map((o, index) => (
                            <option className={styles.option} onClick={() => handleFilterChange(index)}
                                title={o} key={o}>
                                {o}
                            </option>
                        ))}

                    </div>
                }

            </div>

        </>
    );
}

export default Filter;