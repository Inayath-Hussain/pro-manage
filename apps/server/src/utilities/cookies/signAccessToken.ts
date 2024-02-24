import { Response } from "express";

const cookieName = "accessToken"

/**
 * sign's access token with a secret using a cookie-parser and adds it to the response cookies. 
 * @param res express response object
 * @param token access token
 */
export const signAccessTokenCookie = (res: Response, token: string) => {
    res.cookie(cookieName, token, { httpOnly: true, signed: true, expires: new Date(Date.now() + 1000 * 60 * 60 * 2) })
}


/**
 * assign's access token cookie value with empty string and sets expiration date to now.
 * @param res express response object
 */
export const expireAccessTokenCookie = (res: Response) => {
    res.cookie(cookieName, "", { httpOnly: true, expires: new Date() })
}