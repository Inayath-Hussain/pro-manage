import { RequestHandler } from "express";
import { validationResult } from "express-validator"
import { Ierror } from "./errorHandler";

export const checkForErrors: RequestHandler = (req, res, next) => {
    const result = validationResult(req)

    // if there are errors
    if (result.isEmpty() === false) {
        const message = result.array()[0].msg

        return next({ message, statusCode: 400 } as Ierror)
    }

    next();
}