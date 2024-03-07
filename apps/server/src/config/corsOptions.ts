import { CorsOptions } from "cors"
import { env } from "./env"

export const corsOptions: CorsOptions = env.isProd ?
    {
        // add react deployed origin here.
        origin: ["https://pro-manage-lime.vercel.app"],
        credentials: true
    }
    :
    {
        origin: /http:\/\/localhost:.{4}/,
        credentials: true
    }