import { Response } from "express"

/**
 * sign's refresh token with a secret using a cookie-parser and adds it to the response cookies. 
 * @param res express response object
 * @param token refresh token
 */
export const signRefreshTokenCookie = (res: Response, token: string) => {
    res.cookie("refreshToken", token, { httpOnly: true, signed: true, expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 15) })
}