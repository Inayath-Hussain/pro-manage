import { RequestHandler } from "express";
import { Ierror } from "../../utilities/requestHandlers/errorHandler";

export const validateDeleteTaskParam: RequestHandler = (req, res, next) => {
    const { id } = req.params

    if (!id) return next({ statusCode: 400, message: "request must contain task id as parameter" } as Ierror)

    next();
}