import { IUpdateDoneBody, InvalidCheckListItemId, InvalidTaskId } from "@pro-manage/common-interfaces";
import { axiosInstance } from "../instance";
import { AxiosError, GenericAbortSignal, HttpStatusCode } from "axios";
import { apiUrls } from "../URLs";
import { NetworkError } from "../errors";

export const updateDoneService = (payload: IUpdateDoneBody, signal: GenericAbortSignal) => {
    return new Promise(async (resolve, reject) => {
        try {
            const result = await axiosInstance.patch(apiUrls.updateDone, payload, { signal, withCredentials: true })
            return resolve(result)
        }
        catch (ex) {
            if (ex instanceof AxiosError) {
                switch (true) {

                    // if invalid auth tokens or auth tokens are missing
                    case (ex.response?.status === HttpStatusCode.Unauthorized):
                        return reject(false)


                    // if check list item doesn't exist
                    case (ex.response?.status === HttpStatusCode.BadRequest && ex.response.data.invalidCheckListId):
                        const invalidCheckListIdObj = new InvalidCheckListItemId()
                        return reject(invalidCheckListIdObj)


                    // if task doesn't exist
                    case (ex.response?.status === HttpStatusCode.BadRequest && ex.response.data.invalidTaskId):
                        const invalidTaskIdObj = new InvalidTaskId()
                        return reject(invalidTaskIdObj)


                    case (ex.code === AxiosError.ERR_NETWORK):
                        const networkErrorObj = new NetworkError()
                        return reject(networkErrorObj)
                }
            }
            // default
            console.log(ex)
            return reject(ex)
        }
    })
}