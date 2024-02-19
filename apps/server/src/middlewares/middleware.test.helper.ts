import { Request } from "express";
import { IValidateRequestMiddlewares } from "./interface";


/**
* passes request through all validation schemas and then checks for any validation errors in request.
* @returns final next called by middleware.
*/
export const validateRequest = async (middlewares: IValidateRequestMiddlewares, req: Request, res: any, next: any) => {

    // to check the parameters of called next function 
    let finalNext = jest.fn()

    for (let i = 0; i < middlewares.length - 1; i++) {
        await middlewares[i](req, res, next)
    }

    middlewares[middlewares.length - 1](req, res, finalNext)

    return finalNext
}