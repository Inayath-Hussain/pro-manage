import { config } from "dotenv";
import { cleanEnv, port, str } from "envalid";

config()


export const env = cleanEnv(process.env, {
    PORT: port({ default: 8080 }),
    COOKIE_PARSER_SECRET: str()
})