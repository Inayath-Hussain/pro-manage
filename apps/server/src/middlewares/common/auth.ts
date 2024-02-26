import { RequestHandler } from "express";
import { Ierror } from "../../utilities/requestHandlers/errorHandler";
import { validateAuthTokens } from "../../utilities/tokens/validateAuthTokens";
import { createAccessToken, verifyAccessToken } from "../../utilities/tokens/accessToken";
import { renewRefreshToken } from "../../utilities/tokens/refreshToken";
import { signAccessTokenCookie } from "../../utilities/cookies/signAccessToken";
import { signRefreshTokenCookie } from "../../utilities/cookies/signRefreshToken";

export const authMiddleware: RequestHandler = async (req, res, next) => {
    const { accessToken, refreshToken } = req.signedCookies

    const invalidAuthTokenError: Ierror = { statusCode: 401, message: "Invalid authentication tokens" }

    // if no auth tokens are present
    if (!accessToken && !refreshToken) return next({ statusCode: 401, message: "Authentication tokens required" } as Ierror)


    // if only access token is present
    if (!refreshToken) {
        const result = await verifyAccessToken(accessToken)
        if (!result.valid) return next(invalidAuthTokenError)

        // add user's email to request
        req.email = result.payload.email
        return next();
    }

    // if only refresh token is present
    if (!accessToken) {
        // validates and renew's token if necessary
        const result = await renewRefreshToken(refreshToken)

        // if token is invalid
        if (!result.valid) return next(invalidAuthTokenError)

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

    if (!result.valid) return next(invalidAuthTokenError)

    req.email = result.email;

    result.newTokens.forEach(tokenName => {
        if (tokenName === "accessToken") signAccessTokenCookie(res, result.accessToken)
        if (tokenName === "refreshToken") signRefreshTokenCookie(res, result.refreshToken)
    })

    next();
}