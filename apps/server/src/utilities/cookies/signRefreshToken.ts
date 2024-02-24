import { Response } from "express"

const cookieName = "refreshToken"

/**
 * sign's refresh token with a secret using a cookie-parser and adds it to the response cookies. 
 * @param res express response object
 * @param token refresh token
 */
export const signRefreshTokenCookie = (res: Response, token: string) => {
    res.cookie(cookieName, token, { httpOnly: true, signed: true, expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 15) })
}



/**
 * assign's refresh token cookie value with an empty string and sets expiration date to now.
 * @param res express response object
 */
export const expireRefreshTokenCookie = (res: Response) => {
    res.cookie(cookieName, "", { httpOnly: true, expires: new Date() })
}