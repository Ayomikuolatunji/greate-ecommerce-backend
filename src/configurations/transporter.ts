import nodemailer from "nodemailer";
import { google } from "googleapis";
import SMTPTransport from "nodemailer/lib/smtp-transport";
import { ENVIRONMENT_VARIABLES } from "./config";

const auth2 = new google.auth.OAuth2(
  ENVIRONMENT_VARIABLES.GOOGLE_CLIENT_ID,
  ENVIRONMENT_VARIABLES.GOOGLE_CLIENT_SECRET,
  ENVIRONMENT_VARIABLES.GOOGLE_REDIRECT_URL
);

auth2.setCredentials({ refresh_token: ENVIRONMENT_VARIABLES.GOOGLE_REFRESH_TOKEN });

const transporter = async (): Promise<nodemailer.Transporter<SMTPTransport.SentMessageInfo>> => {
  const accessToken = await auth2.getAccessToken();
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: ENVIRONMENT_VARIABLES.G_MAIL,
      clientId: ENVIRONMENT_VARIABLES.GOOGLE_CLIENT_ID,
      clientSecret: ENVIRONMENT_VARIABLES.GOOGLE_CLIENT_SECRET,
      refreshToken: ENVIRONMENT_VARIABLES.GOOGLE_REFRESH_TOKEN,
      accessToken: accessToken as string,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
  return transporter;
};

export default transporter;
