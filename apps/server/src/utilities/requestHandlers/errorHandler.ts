import { ErrorRequestHandler } from "express"

export interface Ierror {
    statusCode: number
    message: string
    // email?: string
    // logout_user?: boolean
}

export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
    const { statusCode = 500,
        message = "Internal server error",
        // email = "",
        // logout_user = false
    } = err

    res.status(statusCode).json({ message })
}