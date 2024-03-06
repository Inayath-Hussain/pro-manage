import { IUpdateBody, IUpdateMiddlewareError, UserUpdateMiddlewareError } from "@pro-manage/common-interfaces"

import { AxiosError, GenericAbortSignal, HttpStatusCode } from "axios"
import { axiosInstance } from "../instance"
import { apiUrls } from "../URLs"
import { NetworkError, UnauthorizedError } from "../errors"


export const userUpdateService = async (payload: IUpdateBody, signal: GenericAbortSignal) => {
    return new Promise(async (resolve, reject) => {
        try {
            const result = await axiosInstance.patch(apiUrls.userUpdate, payload, { signal, withCredentials: true })

            resolve(result)
        } catch (ex) {
            if (ex instanceof AxiosError) {

                if (ex.code === AxiosError.ERR_NETWORK) {
                    const networkErrorObj = new NetworkError();
                    return reject(networkErrorObj)
                }

                const status = ex.response?.status

                switch (status) {
                    case HttpStatusCode.BadRequest:
                        return reject(ex.response?.data.message as string)

                    case HttpStatusCode.Unauthorized:
                        const unauthorizedErrorObj = new UnauthorizedError();
                        return reject(unauthorizedErrorObj)

                    case HttpStatusCode.UnprocessableEntity:
                        const { errors } = ex.response?.data as IUpdateMiddlewareError

                        return reject(new UserUpdateMiddlewareError(ex.response?.data, errors))

                    default:
                        console.log(ex)
                        return reject("Please try again later")
                }
            }

            console.log(ex)
            reject("Please try again later")
        }
    })

}