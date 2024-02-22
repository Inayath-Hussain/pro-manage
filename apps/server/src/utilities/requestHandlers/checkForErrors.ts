import { IRegisterMiddlewareError } from "@pro-manage/common-interfaces";
import { RequestHandler } from "express";
import { validationResult, ValidationError } from "express-validator"

export const checkForErrors: RequestHandler = (req, res, next) => {
    const result = validationResult(req)

    // if there are errors
    if (result.isEmpty() === false) {

        // errors occurred in defined schema
        let fieldErrors: any = {}


        result.array().forEach((r: ValidationError) => {
            if (r.type === "field") {
                fieldErrors[r.path] = r.msg
            }

            // error occurred if there is a field present in the request which is not defined in schema 
            if (r.type === "unknown_fields") {
                fieldErrors.unknownField = r.msg
            }
        })


        const message = "Invalid body"

        const responseObj: IRegisterMiddlewareError = { message, errors: fieldErrors }

        return res.status(422).json(responseObj)

        // return next({ message, statusCode: 400 } as Ierror)
    }

    next();
}