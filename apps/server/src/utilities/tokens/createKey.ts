/**
 * convert a string to Uint8Array
 */
export const createKey = (secret: string) => {
    return new TextEncoder().encode(secret)
}