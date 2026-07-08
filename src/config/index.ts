import dotenv from "dotenv";
dotenv.config();

export const config = {
    port: process.env.PORT,
    app_url: process.env.APP_URL,
    databaseUrl: process.env.DATABASE_URL,
    jwt_access_token_secret: process.env.JWT_ACCESS_TOKEN_SECRET!,
    jwt_refresh_token_secret: process.env.JWT_REFRESH_TOKEN_SECRET!,
    jwt_access_token_expires_in: process.env.JWT_ACCESS_TOKEN_EXPIRES_IN!,
    jwt_refresh_token_expires_in: process.env.JWT_REFRESH_TOKEN_EXPIRES_IN!,
}