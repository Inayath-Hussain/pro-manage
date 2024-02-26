import { SignJWT, jwtVerify, JWTPayload, errors as joseErrors } from "jose"
import { createKey } from "./createKey"
import { env } from "../../config/env"
import { IPayload } from "./interface"


export const createAccessToken = async (payload: IPayload) => {
    const key = createKey(env.JWT_ACCESS_TOKEN_SECRET)

    return await new SignJWT({ ...payload }).setProtectedHeader({ alg: "HS256" }).setIssuedAt().setExpirationTime("2h").sign(key)
}


type VerifiedAuthPayload = JWTPayload & IPayload


interface Ivalid {
    accessToken: string
    valid: true
    payload: VerifiedAuthPayload
}

interface Iinvalid {
    accessToken: string
    valid: false
    errorType: "expired" | "invalid"
}

type Ireturn = Ivalid | Iinvalid

export const verifyAccessToken = async (jwtToken: string): Promise<Ireturn> => {
    const key = createKey(env.JWT_ACCESS_TOKEN_SECRET)

    try {
        const { payload } = await jwtVerify<VerifiedAuthPayload>(jwtToken, key, { algorithms: ["HS256"] })

        return { accessToken: jwtToken, valid: true, payload: payload }
    }
    catch (ex) {
        if (ex instanceof joseErrors.JWTExpired) return { accessToken: jwtToken, valid: false, errorType: "expired" }

        return { accessToken: jwtToken, valid: false, errorType: "invalid" }
    }
}