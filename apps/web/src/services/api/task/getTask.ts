import { AxiosError, GenericAbortSignal } from "axios";
import { apiUrls } from "../URLs";
import { axiosInstance } from "../instance";

type IFilter = "day" | "week" | "month"

export const getTaskService = async (filter: IFilter, signal: GenericAbortSignal) => {
    return new Promise(async (resolve, reject) => {
        try {
            const result = await axiosInstance.get(apiUrls.getTask + "?filter=" + filter, { signal, withCredentials: true })

            resolve(result.data)
        }
        catch (ex) {
            if (ex instanceof AxiosError) {
                // if user is not authenticated then false value is returned( to navigate user to login page)
                if (ex.response?.status === 401) return reject(false);
            }

            console.log(ex)
            reject(ex)
        }
    })
}