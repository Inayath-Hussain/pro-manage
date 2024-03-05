import { ITaskJSON, InvalidTaskId, PublicTaskMiddlewareError } from "@pro-manage/common-interfaces"
import { apiUrls } from "../URLs"
import { axiosInstance } from "../instance"
import { AxiosError, HttpStatusCode } from "axios"
import { NetworkError } from "../errors"

export const getTaskPublicService = (taskId: string) =>
    new Promise<ITaskJSON>(async (resolve, reject) => {
        try {
            const result = await axiosInstance.get(apiUrls.getPublicTask(taskId))
            return resolve(result.data.task)
        }
        catch (ex) {
            if (ex instanceof AxiosError) {
                switch (true) {
                    case (ex.response?.status === HttpStatusCode.UnprocessableEntity):
                        const middlewareError = new PublicTaskMiddlewareError(ex.response.data.message, ex.response.data.errors)
                        return reject(middlewareError)


                    case (ex.response?.status === HttpStatusCode.NotFound):
                        const invalidTaskId = new InvalidTaskId();
                        return reject(invalidTaskId)


                    case (ex.code === AxiosError.ERR_NETWORK):
                        const networkErrorObj = new NetworkError();
                        return reject(networkErrorObj)
                }
            }

            console.log(ex)
            return reject("Please try again later")
        }
    })