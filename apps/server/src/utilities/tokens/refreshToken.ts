import { SignJWT, jwtVerify, JWTPayload, errors as joseErrors } from "jose"
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

interface IVerifyValid {
    refreshToken: string
    valid: true
    payload: VerifiedPayload
}

interface IVerifyInvalid {
    refreshToken: string
    valid: false
}

type IVerifyReturn = IVerifyValid | IVerifyInvalid


export const verifyRefreshToken = async (token: string): Promise<IVerifyReturn> => {
    const key = createKey(env.JWT_REFRESH_TOKEN_SECRET)

    try {

        const { payload } = await jwtVerify<VerifiedPayload>(token, key, { algorithms: ["HS256"] })

        return { refreshToken: token, valid: true, payload }
    }
    catch (ex) {
        if (ex instanceof joseErrors.JWTExpired) return { refreshToken: token, valid: false }

        return { refreshToken: token, valid: false }
    }
}








interface RenewValid {
    refreshToken: string
    valid: true
    email: string
    newToken: boolean
}

interface RenewInvalid {
    refreshToken: string
    valid: false
}

type RenewReturn = RenewValid | RenewInvalid

/**
 * validates refresh token and creates a new one if creation date is older than 1 day.
 * @param refreshToken 
 * @returns refreshToken(either same or new), 
 * 
 * valid status(value is true if new token is being sent or current token is valid),
 * 
 * email(if valid status is true, email encoded in token is sent)
 * 
 *  newToken (set to true if token is renewed)
 */
export const renewRefreshToken = async (refreshToken: string): Promise<RenewReturn> => {

    let finalRefreshToken = refreshToken
    let newToken = false

    const result = await verifyRefreshToken(refreshToken)

    if (result.valid) {
        const { payload } = result

        if (!payload.iat || !payload.email) return { refreshToken, valid: false }

        // check creation date
        // renew if issue date is older than 1 day.
        if (_olderThanOneDay(payload.iat)) {
            finalRefreshToken = await createRefreshToken({ email: payload.email })
            newToken = true
        }


        // return token and valid state
        return { refreshToken: finalRefreshToken, valid: true, email: payload.email, newToken }
    }

    // return token and invalid state
    return { refreshToken, valid: false }
}




// checks and returns if issuedAt date of jwt token is atleast a day older
const _olderThanOneDay = (jwtDate: number) => {
    // representation of one day in milliseconds
    const oneDayInMs = 1000 * 60 * 60 * 24

    const difference = (Date.now() - (jwtDate * 1000)) / oneDayInMs

    return difference >= 1
}