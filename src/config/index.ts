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
    stripe_secret_key: process.env.STRIPE_SECRET_KEY!,
    stripe_publishable_key: process.env.STRIPE_PUBLISHABLE_KEY!,
    stripe_webhook_secret: process.env.STRIPE_WEBHOOK_SECRET!,
    stripe_currency: process.env.STRIPE_CURRENCY ?? "usd",
    stripe_success_url: process.env.STRIPE_SUCCESS_URL ?? `${process.env.APP_URL ?? "http://localhost:5000"}/`,
    stripe_cancel_url: process.env.STRIPE_CANCEL_URL ?? `${process.env.APP_URL ?? "http://localhost:5000"}/api/payments`,
}