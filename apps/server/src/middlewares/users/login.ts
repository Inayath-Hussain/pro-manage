import { ILoginBody, LoginBodyError } from '@pro-manage/common-interfaces';

import { RequestHandler } from 'express';
import { trim } from 'validator';
import { emailValidator } from './validators';



export const validateLoginBody: RequestHandler<{}, {}, ILoginBody> = (req, res, next) => {
    let { email, password } = req.body

    if (typeof email === "string") email = trim(email)
    if (typeof password === "string") password = trim(password)


    const errorObj = new LoginBodyError("Invalid body");

    const emailValidationResult = emailValidator(email)
    if (emailValidationResult.valid === false) errorObj.addFieldErrors("email", emailValidationResult.errorMessage)


    switch (true) {
        case (!password):
            errorObj.addFieldErrors("password", "password is required")
            break;

        case (typeof password !== "string"):
            errorObj.addFieldErrors("password", "password should be of type 'string'")

    }



    if (Object.keys(errorObj.errors).length > 0) return res.status(422).json(errorObj)

    return next();
}