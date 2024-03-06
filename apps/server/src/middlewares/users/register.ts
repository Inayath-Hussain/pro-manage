import { IRegisterBody, RegisterBodyError } from "@pro-manage/common-interfaces";

import { RequestHandler } from "express";
import { trim } from "validator";
import { emailValidator, nameValidator, p } from "./validators";





export const validateRegisterBody: RequestHandler<{}, {}, IRegisterBody> = (req, res, next) => {
    let { email, name, password } = req.body

    // trim
    if (typeof email === "string") email = trim(email)
    if (typeof name === "string") name = trim(name)
    if (typeof password === "string") password = trim(password)

    const errorObj = new RegisterBodyError("Invalid body");

    const emailValidationResult = emailValidator(email)
    if (emailValidationResult.valid === false) errorObj.addFieldErrors("email", emailValidationResult.errorMessage)


    // validating name
    switch (true) {
        case (!name):
            errorObj.addFieldErrors("name", "name is required")
            break;

        case (typeof name !== "string"):
            errorObj.addFieldErrors("name", "name should be of type 'string'");
            break;

        case (nameValidator.notNumeric(name) === false):
            errorObj.addFieldErrors("name", 'name should contain letters')
            break;
    }


    const passwordValidationResult = p(password)
    if (passwordValidationResult.valid === false) errorObj.addFieldErrors("password", passwordValidationResult.errorMessage)


    if (Object.keys(errorObj.errors).length > 0) return res.status(422).json(errorObj)


    return next();
}