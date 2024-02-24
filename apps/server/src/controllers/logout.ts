import { RequestHandler } from "express";
import { expireAccessTokenCookie } from "../utilities/cookies/signAccessToken";
import { expireRefreshTokenCookie } from "../utilities/cookies/signRefreshToken";


export const logoutController: RequestHandler = (req, res, next) => {
    expireAccessTokenCookie(res)
    expireRefreshTokenCookie(res)

    res.status(204).send();
}