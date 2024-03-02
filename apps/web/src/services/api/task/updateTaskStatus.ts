import { IUpdateTaskStatusBody } from "@pro-manage/common-interfaces";
import { apiUrls } from "../URLs";
import { axiosInstance } from "../instance";
import { AxiosError, GenericAbortSignal } from "axios";


export class TaskDonotExist {
    message: string;

    constructor(message: string) {
        this.message = message
    }
}

export const updateTaskStatusService = async (payload: IUpdateTaskStatusBody, signal: GenericAbortSignal) => {
    return new Promise(async (resolve, reject) => {
        try {
            const result = await axiosInstance.patch(apiUrls.updateTaskStatus, payload, { withCredentials: true, signal })

            resolve(result.data)
        }
        catch (ex) {
            if (ex instanceof AxiosError) {

                switch (true) {
                    case (ex.response?.status === 401):
                        return reject(false);

                    case (ex.response?.status === 404):
                        const errorObj = new TaskDonotExist(ex.response.data.message)
                        return reject(errorObj)


                }

                AxiosError.ERR_NETWORK
                console.log(ex)
                return reject("Please try again later")
            }
        }
    })
}