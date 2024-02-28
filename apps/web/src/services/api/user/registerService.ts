import { IRegisterBody, IRegisterMiddlewareError } from "@pro-manage/common-interfaces";

import { AxiosError, GenericAbortSignal, HttpStatusCode } from "axios";
import { axiosInstance } from "../instance";
import { apiUrls } from "../URLs";


/**
 * api call to register new user
 */
export const registerService = async (payload: IRegisterBody, signal: GenericAbortSignal) => {

    return new Promise(async (resolve, reject) => {

        try {
            const result = await axiosInstance.post(apiUrls.registerURL, payload, { signal, withCredentials: true })

            resolve(result)
        }
        catch (ex) {
            if (ex instanceof AxiosError) {

                // middleware errors
                // if request body validation was failed
                if (ex.response?.status === HttpStatusCode.UnprocessableEntity) {
                    const { errors } = ex.response?.data as IRegisterMiddlewareError

                    reject(errors)
                }

                // if email already exists or any error occurred in server
                if (ex.response?.status === HttpStatusCode.Conflict ||
                    ex.response?.status === HttpStatusCode.InternalServerError) {
                    // controller errors
                    const { message } = ex.response?.data

                    reject(message as string)
                }
                else {
                    reject("Please try again later")
                }

            }

            console.log(ex)
            reject("Please try again later")
        }

    })


}