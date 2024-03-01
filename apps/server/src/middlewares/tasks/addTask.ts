import { AddTaskMiddlewareError, IAddTaskBody } from "@pro-manage/common-interfaces"

import { RequestHandler } from "express";
import { trim } from "validator";
import { validateCheckList, validateDueDate, validatePriority, validateTitle } from "./validators";

export const validateAddTaskBody: RequestHandler<{}, {}, IAddTaskBody> = (req, res, next) => {

    let { title, checkList, priority, dueDate } = req.body;

    if (typeof title === "string") title = trim(title)
    if (typeof priority === "string") priority = trim(priority)

    const errorObj = new AddTaskMiddlewareError("Invalid body")


    const titleValidationResult = validateTitle(title);
    // when title validation fails then validation error is added to errorObj
    if (titleValidationResult.valid === false) errorObj.addFieldError("title", titleValidationResult.errorMessage)


    const dueDateValidationResult = validateDueDate(dueDate)
    // when dueDate validation fails then validation error is added to errorObj
    if (dueDateValidationResult.valid === false) errorObj.addFieldError("dueDate", dueDateValidationResult.errorMessage)


    const priorityValidationResult = validatePriority(priority);
    // when priority validation fails then validation error is added to errorObj
    if (priorityValidationResult.valid === false) errorObj.addFieldError("priority", priorityValidationResult.errorMessage)


    const checkListResult = validateCheckList(checkList)
    // when checkList validation fails then validation error is added to errorObj
    if (!checkListResult.valid) errorObj.addFieldError("checkList", checkListResult.errorMessage)


    // if errorObj has any errors then send them as repsone
    if (Object.keys(errorObj.errors).length > 0) return res.status(422).json(errorObj)


    next()
}