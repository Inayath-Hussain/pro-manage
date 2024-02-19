import { SignJWT, jwtVerify, JWTPayload } from "jose"
import { env } from "../../config/env"
import { createKey } from "./createKey"
import { IPayload } from "./interface"

/**
 * creates jwt refresh token
 */
export const createRefreshToken = async (payload: IPayload) => {
    const key = createKey(env.JWT_REFRESH_TOKEN_SECRET)

    return await new SignJWT({ ...payload }).setProtectedHeader({ alg: "HS256" }).setIssuedAt().setExpirationTime("15d").sign(key)
}


type VerifiedPayload = IPayload & JWTPayload

export const verifyRefreshTOken = async (token: string) => {
    const key = createKey(env.JWT_REFRESH_TOKEN_SECRET)

    return await jwtVerify<VerifiedPayload>(token, key, { algorithms: ["HS256"] })
}