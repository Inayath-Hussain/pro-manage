import { UserInfo } from "@pro-manage/common-interfaces"

import { AxiosError, GenericAbortSignal, HttpStatusCode } from "axios"
import { apiUrls } from "../URLs"
import { axiosInstance } from "../instance"

export const getUserInfoService = async (signal: GenericAbortSignal) => {
    return new Promise<UserInfo>(async (resolve, reject) => {
        try {
            const result = await axiosInstance.get<UserInfo>(apiUrls.userInfo, { signal, withCredentials: true })

            return resolve(result.data)
        }
        catch (ex) {
            if (ex instanceof AxiosError) {
                const status = ex.response?.status
                if (status === HttpStatusCode.Unauthorized) return reject(false)
            }

            console.log(ex)
            reject("Please try again later");
        }
    })
}