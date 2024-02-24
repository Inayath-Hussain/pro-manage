import { GenericAbortSignal } from "axios";
import { apiUrls } from "./URLs";
import { axiosInstance } from "./instance";

export const logoutService = async (signal: GenericAbortSignal) => {
    await axiosInstance.post(apiUrls.logoutURL, {}, { withCredentials: true, signal })
}