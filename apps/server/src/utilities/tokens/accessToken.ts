import { SignJWT, jwtVerify, JWTPayload } from "jose"
import { createKey } from "./createKey"
import { env } from "../../config/env"
import { IPayload } from "./interface"


export const createAccessToken = async (payload: IPayload) => {
    const key = createKey(env.JWT_ACCESS_TOKEN_SECRET)

    return await new SignJWT({ ...payload }).setProtectedHeader({ alg: "HS256" }).setIssuedAt().setExpirationTime("2h").sign(key)
}


type VerifiedAuthPayload = JWTPayload & IPayload

export const verifyAccessToken = async (jwtToken: string) => {
    const key = createKey(env.JWT_ACCESS_TOKEN_SECRET)

    return await jwtVerify<VerifiedAuthPayload>(jwtToken, key, { algorithms: ["HS256"] })
}