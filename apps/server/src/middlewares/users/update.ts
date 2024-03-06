import { IUpdateBody, UserUpdateMiddlewareError } from "@pro-manage/common-interfaces";

import { RequestHandler } from "express";
import { trim } from "validator";
import { nameValidator, passwordValidator, passwordValidatorErrorMessages } from "./validators";



export const validateUpdateBody: RequestHandler<{}, {}, IUpdateBody> = async (req, res, next) => {
    let { name, newPassword, oldPassword } = req.body

    // object to store all validation errors present in values
    const errorObj = new UserUpdateMiddlewareError("Invalid body");

    // trim values
    if (typeof name === "string") name = trim(name)
    if (typeof oldPassword === "string") oldPassword = trim(oldPassword)
    if (typeof newPassword === "string") newPassword = trim(newPassword)

    // if none of the required fields are present
    if (!name && !newPassword && !oldPassword) return res.status(400).json({ message: "Atleast name or old and new passwords should be provided to update." })


    // if name is present
    // validate and if any errors occurred store it in errorObj
    if (name) {
        // if not numeric check fails
        if (!nameValidator.notNumeric(name)) errorObj.addFieldError("name", "name should contain letters")
    }


    // validate both passwords and if any errors occurred store it in errorObj
    // if any one or both oldPassword and newPassword are present
    if (oldPassword || newPassword) {

        // checks if newPassword is present but oldPassword isn't
        if (!oldPassword) errorObj.addFieldError("oldPassword", "oldPassword is required")

        // checks if oldPassword is present but newPassword isn't
        if (!newPassword) errorObj.addFieldError("newPassword", "newPassword is required")

        if (oldPassword && newPassword) {
            // check if newPassword meets password criteria
            if (passwordValidator.validLength(newPassword) === false) errorObj.addFieldError("newPassword", passwordValidatorErrorMessages.length)
            else if (passwordValidator.isStrongPassword(newPassword) === false) errorObj.addFieldError("newPassword", passwordValidatorErrorMessages.StrongPassword)
        }
    }


    // checks if errorObj is empty
    if (Object.keys(errorObj.errors).length > 0) return res.status(422).json(errorObj)

    next()
}