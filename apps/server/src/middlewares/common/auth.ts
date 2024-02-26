import { RequestHandler } from "express";
import { expireAccessTokenCookie, signAccessTokenCookie } from "../../utilities/cookies/signAccessToken";
import { expireRefreshTokenCookie, signRefreshTokenCookie } from "../../utilities/cookies/signRefreshToken";
import { Ierror } from "../../utilities/requestHandlers/errorHandler";
import { createAccessToken, verifyAccessToken } from "../../utilities/tokens/accessToken";
import { renewRefreshToken } from "../../utilities/tokens/refreshToken";
import { validateAuthTokens } from "../../utilities/tokens/validateAuthTokens";


export const authMiddleware: RequestHandler = async (req, res, next) => {
    const { accessToken, refreshToken } = req.signedCookies

    // if no auth tokens are present
    if (!accessToken && !refreshToken) return next({ statusCode: 401, message: "Authentication tokens required" } as Ierror)

    // remove cookies when auth tokens are invalid
    const invalidResponse = () => {
        expireAccessTokenCookie(res)
        expireRefreshTokenCookie(res)

        return next({ statusCode: 401, message: "Invalid authentication tokens" } as Ierror)
    }

    // if only access token is present
    if (!refreshToken) {
        const result = await verifyAccessToken(accessToken)
        if (!result.valid) return invalidResponse();

        // add user's email to request
        req.email = result.payload.email
        return next();
    }

    // if only refresh token is present
    if (!accessToken) {
        // validates and renew's token if necessary
        const result = await renewRefreshToken(refreshToken)

        // if token is invalid
        if (!result.valid) return invalidResponse();

        // create access token
        const newAccessToken = await createAccessToken({ email: result.email })

        req.email = result.email

        // create cookies
        signAccessTokenCookie(res, newAccessToken)
        if (result.newToken) signRefreshTokenCookie(res, result.refreshToken)

        return next();
    }


    // if both tokens are present
    const result = await validateAuthTokens(accessToken, refreshToken)

    if (!result.valid) return invalidResponse();

    req.email = result.email;

    result.newTokens.forEach(tokenName => {
        if (tokenName === "accessToken") signAccessTokenCookie(res, result.accessToken)
        if (tokenName === "refreshToken") signRefreshTokenCookie(res, result.refreshToken)
    })

    next();
}