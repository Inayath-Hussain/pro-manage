import { IUpdateBody, IUpdateMiddlewareError } from "@pro-manage/common-interfaces";

import { RequestHandler } from "express";
import { trim } from "validator";
import { nameValidator, passwordValidator, passwordValidatorErrorMessages } from "./validators";


// sanitization
export const validateUpdateBody: RequestHandler<{}, {}, IUpdateBody> = async (req, res, next) => {
    let { name, newPassword, oldPassword } = req.body

    // object to store all validation errors present in values
    const errorObj: IUpdateMiddlewareError["errors"] = {}

    // trim values
    if (typeof name === "string") name = trim(name)
    if (typeof oldPassword === "string") oldPassword = trim(oldPassword)
    if (typeof newPassword === "string") newPassword = trim(newPassword)

    // if none of the required fields are present
    if (!name && !newPassword && !oldPassword) return res.status(400).json({ message: "Atleast name or old and new passwords should be provided to update." })


    // if name is present
    // validate and store if any errors occurred
    if (name) {
        if (!nameValidator.notNumeric(name)) errorObj.name = "name should contain letters"
    }


    // validate both and store any errors in errorObj
    // if any one or both oldPassword and newPassword are present
    if (oldPassword || newPassword) {

        // checks if newPassword is present but oldPassword isn't
        if (!oldPassword) errorObj.oldPassword = "oldPassword is required"

        // checks if oldPassword is present but newPassword isn't
        if (!newPassword) errorObj.newPassword = "newPassword is required"
        else {
            // check if newPassword meets password criteria
            if (passwordValidator.validLength(newPassword) === false) errorObj.newPassword = passwordValidatorErrorMessages.length
            else if (passwordValidator.isStrongPassword(newPassword) === false) errorObj.newPassword = passwordValidatorErrorMessages.StrongPassword
        }
    }

    // if Object.keys(errorObj) = 0 call next
    // else send 422 response along with errorObj
    if (Object.keys(errorObj).length > 0) return res.status(422).json({ message: "Invalid body", errors: errorObj } as IUpdateMiddlewareError)

    next()
}