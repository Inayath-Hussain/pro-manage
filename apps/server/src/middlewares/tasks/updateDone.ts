import { IUpdateDoneBody, UpdateDoneBodyError } from "@pro-manage/common-interfaces";

import { RequestHandler } from "express";
import { trim } from "validator";
import { validateTaskID } from "./validators";


export const validateUpdateDoneBody: RequestHandler<{}, {}, IUpdateDoneBody> = (req, res, next) => {
    let { checkListId, done, taskId } = req.body

    const errorObj = new UpdateDoneBodyError("Invalid body")

    if (typeof checkListId === "string") checkListId = trim(checkListId)
    if (typeof taskId === "string") taskId = trim(taskId)


    // validate checkList Id
    switch (true) {
        case (!checkListId):
            errorObj.addFieldError("checkListId", "checkListId is required");
            break;

        case (typeof checkListId !== "string"):
            errorObj.addFieldError("checkListId", "checkListId should be of type 'string'")
            break;
    }


    const taskIdValidationResult = validateTaskID(taskId)
    if (taskIdValidationResult.valid === false) errorObj.addFieldError("taskId", taskIdValidationResult.errorMessage)


    // validate done
    switch (true) {
        case (done === undefined || done === null):
            errorObj.addFieldError("done", "done is required")
            break;

        case (typeof done !== "boolean"):
            errorObj.addFieldError("done", "done should be of type 'boolean'");
            break;
    }


    if (Object.keys(errorObj.errors).length > 0) return res.status(422).json(errorObj)


    return next()
}