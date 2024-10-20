import { config } from "dotenv";
import { cleanEnv, str } from "envalid";
import path from "path";

const envPath = path.resolve(__dirname, "../../", ".env");

// Load .env file
config({ path: envPath });

// Validate environment variables
export const ENVIRONMENT_VARIABLES = cleanEnv(process.env, {
  // Server
  NODE_ENV: str({
    choices: ["development", "production"],
    default: "development",
  }),

  // google environment variables
  GOOGLE_CLIENT_ID: str(),
  GOOGLE_CLIENT_SECRET: str(),
  GOOGLE_REDIRECT_URL: str(),
  GOOGLE_REFRESH_TOKEN: str(),
  G_MAIL: str(),


  // JWT environment variables
  JWT_SECRET_KEY: str(),
  // Server environment variables
  PORT: str(),
});
