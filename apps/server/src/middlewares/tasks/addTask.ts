import { AddTaskMiddlewareError, IAddTaskBody } from "@pro-manage/common-interfaces"

import { RequestHandler } from "express";
import { trim } from "validator";
import { validateCheckList, validatePriority } from "./validators";

export const validateAddTaskBody: RequestHandler<{}, {}, IAddTaskBody> = (req, res, next) => {

    let { title, checkList, priority, dueDate } = req.body;

    if (typeof title === "string") title = trim(title)
    if (typeof priority === "string") priority = trim(priority)

    const errorObj = new AddTaskMiddlewareError("Invalid body")


    // check if title exists and is of type string
    if (!title) errorObj.addFieldError("title", "title is required");
    else if (typeof title !== "string") errorObj.addFieldError("title", "title should be type 'string'");

    // check if dueDate is of type Date
    if (dueDate !== undefined && !(Date.parse(dueDate))) errorObj.addFieldError("dueDate", "Invalid date")

    // validate priority field
    const priorityValidationResult = validatePriority(priority);

    // if priority validation failed then add validation error to errorObj
    if (priorityValidationResult.valid === false) errorObj.addFieldError("priority", priorityValidationResult.errorMessage)

    // validate checkList field
    const checkListResult = validateCheckList(checkList)

    // if checkList validation failed then add validation error to errorObj
    if (!checkListResult.valid) errorObj.addFieldError("checkList", checkListResult.errorMessage)

    // if errorObj has any errors then send them as repsone
    if (Object.keys(errorObj.errors).length > 0) return res.status(422).json(errorObj)


    next()
}