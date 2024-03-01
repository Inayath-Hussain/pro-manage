import { IUpdateTaskStatusBody, UpdateTaskStatusMiddlewareError } from "@pro-manage/common-interfaces";

import { RequestHandler } from "express";
import { trim } from "validator";
import { validateStatus, validateTaskID } from "./validators";


export const validateUpdateTaskStatusBody: RequestHandler<{}, {}, IUpdateTaskStatusBody> = (req, res, next) => {
    let { taskId, status } = req.body

    if (typeof taskId === "string") taskId = trim(taskId)
    if (typeof status === "string") status = trim(status)

    const errorObj = new UpdateTaskStatusMiddlewareError("Invalid body");

    const taskIdValidationResult = validateTaskID(taskId)
    if (taskIdValidationResult.valid === false) errorObj.addFieldError("taskId", taskIdValidationResult.errorMessage)

    const statusValidationResult = validateStatus(status)
    if (statusValidationResult.valid === false) errorObj.addFieldError("status", statusValidationResult.errorMessage)



    // if errorObj has any errors then send them as repsone
    if (Object.keys(errorObj.errors).length > 0) return res.status(422).json(errorObj)


    next()
}