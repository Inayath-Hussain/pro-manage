import { RequestHandler } from "express";
import { validationResult, ValidationError } from "express-validator"

export const checkForErrors: RequestHandler = (req, res, next) => {
    const result = validationResult(req)

    // if there are errors
    if (result.isEmpty() === false) {

        // errors occurred in defined schema
        let fieldErrors: any = {}

        // error occurred if there is a field present in the request which is not defined in schema 
        let unknownFieldMessage = ""

        result.array().forEach((r: ValidationError) => {
            if (r.type === "field") {
                fieldErrors[r.path] = r.msg
            }

            if (r.type === "unknown_fields") {
                unknownFieldMessage = r.msg
            }
        })


        const message = unknownFieldMessage || "Invalid body"

        const responseObj = { message, errors: fieldErrors }

        return res.status(400).json(responseObj)

        // return next({ message, statusCode: 400 } as Ierror)
    }

    next();
}