import { RequestHandler } from "express";
import { Ierror } from "./errorHandler";

export const tryCatchWrapper = (asyncRequestHandler: RequestHandler): RequestHandler => async (req, res, next) => {
    try {
        await asyncRequestHandler(req, res, next)
    }
    catch (ex) {
        console.log(ex)
        next({ statusCode: 500, message: "" } as Ierror)
    }
}