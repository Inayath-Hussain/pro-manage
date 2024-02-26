import { createAccessToken, verifyAccessToken } from "./accessToken";
import { renewRefreshToken } from "./refreshToken";



interface ValidResult {
    accessToken: string
    refreshToken: string
    valid: true
    email: string
    newTokens: ("accessToken" | "refreshToken")[]
}

interface InvalidResult {
    accessToken: string
    refreshToken: string
    valid: false
}

type IResult = ValidResult | InvalidResult


/**
 * validates and renew's tokens if necessary and returns object containing auth tokens and valid state
 * @returns
 * accessToken - new or same as passed in arguments
 * 
 * refreshToken - new or same as passed in arguments
 * 
 * valid - whether auth tokens are valid or not
 * 
 * email - email encoded in auth tokens. only returned when tokens are valid
 * 
 * newTokens - array indicating which tokens are renewed
 */
export const validateAuthTokens = async (accessToken: string, refreshToken: string): Promise<IResult> => {
    // these variables are used to store any new auth tokens generated in process
    let finalAccessToken = accessToken
    let finalRefreshToken = refreshToken

    // store all the names of the new tokens generated. (this is used to create new cookies of respective tokens)
    let newTokens: ValidResult["newTokens"] = []

    const accessTokenStatus = await verifyAccessToken(accessToken)

    // if accessToken is valid
    if (accessTokenStatus.valid) {
        const renewedResult = await renewRefreshToken(refreshToken)

        if (renewedResult.valid) {
            finalRefreshToken = renewedResult.refreshToken
            // if token is renewed then push to newToken array
            if (renewedResult.newToken) newTokens.push("refreshToken")

            // if both tokens are valid then send valid object
            return { accessToken, refreshToken: finalRefreshToken, valid: true, email: accessTokenStatus.payload.email, newTokens }
        }
    }



    // if accessToken is expired.
    if (!accessTokenStatus.valid && accessTokenStatus.errorType === "expired") {
        // verify refresh
        const result = await renewRefreshToken(refreshToken)

        // renew access
        if (result.valid) {
            finalRefreshToken = result.refreshToken
            if (result.newToken) newTokens.push("refreshToken")

            const { email } = result
            finalAccessToken = await createAccessToken({ email })
            newTokens.push("accessToken")

            return { accessToken: finalAccessToken, refreshToken: finalRefreshToken, valid: true, email: result.email, newTokens }
        }
    }


    // if accessToken is invalid or refresh token is invalid
    return { accessToken, refreshToken, valid: false }
}

