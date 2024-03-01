import { getTasksFilterValues } from "@pro-manage/common-interfaces";

import { RequestHandler } from "express";
import { Ierror } from "../../utilities/requestHandlers/errorHandler";

export const validateGetTaskQuery: RequestHandler = (req, res, next) => {
    let filter = req.query.filter as string

    switch (true) {
        // if filter query doesn't exist
        case (!filter):
            return next({ statusCode: 401, message: "filter query must be provided" } as Ierror);

        // asserted filter type to use includes method
        case (getTasksFilterValues.includes(filter as typeof getTasksFilterValues[number]) === false):
            return next({ statusCode: 400, message: `filter query should be one of the values '${getTasksFilterValues.join(", ")}'` } as Ierror)
    }

    next();
}