import { RequestHandler } from "express";
import { validateTaskID } from "./validators";
import { trim } from "validator";
import { PublicTaskMiddlewareError } from "@pro-manage/common-interfaces";

export const validatePublicTaskId: RequestHandler = (req, res, next) => {
    let { id } = req.params;

    if (typeof id === "string") id = trim(id);

    const errorObj = new PublicTaskMiddlewareError("Invalid body")

    const taskIdValidationResult = validateTaskID(id)
    if (taskIdValidationResult.valid === false) errorObj.addFieldError("taskId", taskIdValidationResult.errorMessage)


    if (Object.keys(errorObj.errors).length > 0) return res.status(422).json(errorObj)

    return next();
}