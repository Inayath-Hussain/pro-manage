import { getTasksFilterValues } from "@pro-manage/common-interfaces";

import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import ArrowIcon from "@web/assets/icons/down-arrow.svg"
import { useAbortController } from "@web/hooks/useAbortContoller";
import { routes } from "@web/routes";
import { getTaskService } from "@web/services/api/task/getTask";

import styles from "./Filter.module.css"
import { renewTaskAction } from "@web/store/slices/taskSlice";
import { NetworkError } from "@web/services/api/errors";
import { filterSelector, updateFilter } from "@web/store/slices/filterSlice";


type OptionValues = typeof getTasksFilterValues[number]

const Filter: React.FC = () => {

    const selectedFilter = useSelector(filterSelector);

    // state to display and hide filter options
    const [open, setOpen] = useState(false);

    const filterContainerRef = useRef<HTMLDivElement | null>(null);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { signalRef, renewController } = useAbortController();


    useEffect(() => {

        const handleClose = (e: MouseEvent) => {
            // if user clicks outside of options container then closes the options
            if (filterContainerRef.current && !e.composedPath().includes(filterContainerRef.current)) setOpen(false)
        }

        document.addEventListener("click", handleClose)

        return () => {
            document.removeEventListener("click", handleClose)
        }
    }, [])


    const handleOpen = () => {
        setOpen(!open)
    }


    const handleFilterChange = async (value: OptionValues) => {

        // abort signalRef
        signalRef.current.abort();
        renewController();

        // make call
        try {
            const result = await getTaskService(value, signalRef.current.signal)

            dispatch(renewTaskAction(result))

            // and then change selectedFilter

            dispatch(updateFilter(value))
        }
        catch (ex) {
            switch (true) {
                case (ex === false):
                    navigate(routes.user.login)
                    break;

                case (ex instanceof NetworkError):
                    // Check your network and try again toast
                    break;


                default:
                    console.log(ex)
                // something went wrong try again later toast
            }
        }
    }




    interface Ioptions {
        value: OptionValues
        displayText: string
    }

    const options: Ioptions[] = [
        { displayText: "Today", value: "day" },
        { displayText: "This Week", value: "week" },
        { displayText: "This Month", value: "month" }
    ]


    const displayText = options.find(o => o.value === selectedFilter)?.displayText

    return (
        <>

            <div className={styles.filter_container} onClick={handleOpen} ref={filterContainerRef}>
                {displayText}

                <img src={ArrowIcon} alt="" />



                {open &&
                    <div className={styles.options_container}>


                        {options.map(o => (
                            <option className={styles.option} onClick={() => handleFilterChange(o.value)}
                                title={o.displayText} key={o.value}>
                                {o.displayText}
                            </option>
                        ))}

                    </div>
                }

            </div>

        </>
    );
}

export default Filter;