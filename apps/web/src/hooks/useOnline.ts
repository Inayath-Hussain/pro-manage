import { useEffect, useState } from "react";

/**
 * variable which indicates when user is offline or online. can be helpful when trying to send a api call
 */
export const useOnline = () => {
    const [isOnline, setIsOnline] = useState(navigator.onLine);

    useEffect(() => {
        const handleOnline = () => {
            setIsOnline(true)
        }

        const handleOffline = () => {
            setIsOnline(false)
        }

        window.addEventListener("online", handleOnline)
        window.addEventListener("offline", handleOffline)

        return () => {
            window.removeEventListener("online", handleOnline)
            window.removeEventListener("offline", handleOffline)
        }

    }, [])

    return { isOnline };
}