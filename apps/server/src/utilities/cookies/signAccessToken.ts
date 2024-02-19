import { Response } from "express";

/**
 * sign's access token with a secret using a cookie-parser and adds it to the response cookies. 
 * @param res express response object
 * @param token access token
 */
export const signAccessTokenCookie = (res: Response, token: string) => {
    res.cookie("accessToken", token, { httpOnly: true, signed: true, expires: new Date(Date.now() + 1000 * 60 * 60 * 2) })
}