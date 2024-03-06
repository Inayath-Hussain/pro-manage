import { IRegisterBody, RegisterBodyError } from "@pro-manage/common-interfaces";

import { AxiosError, GenericAbortSignal, HttpStatusCode } from "axios";
import { axiosInstance } from "../instance";
import { apiUrls } from "../URLs";
import { NetworkError } from "../errors";


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
                switch (true) {
                    case (ex.response?.status === HttpStatusCode.UnprocessableEntity):
                        const registerBodyError = new RegisterBodyError(ex.response.data.message, ex.response.data.errors)
                        return reject(registerBodyError)

                    case (ex.response?.status === HttpStatusCode.Conflict ||
                        ex.response?.status === HttpStatusCode.InternalServerError):
                        const { message } = ex.response?.data
                        return reject(message as string)

                    case (ex.code === AxiosError.ERR_NETWORK):
                        const networkErrorObj = new NetworkError();
                        return reject(networkErrorObj.message)
                }
            }

            console.log(ex)
            reject("Please try again later")
        }

    })


}