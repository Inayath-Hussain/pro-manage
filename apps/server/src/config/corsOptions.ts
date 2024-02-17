import { CorsOptions } from "cors"
import { env } from "./env"

export const corsOptions: CorsOptions = env.isProd ?
    {
        // add react deployed origin here.
        origin: [],
        credentials: true
    }
    :
    {
        origin: /http:\/\/localhost:.{4}/,
        credentials: true
    }