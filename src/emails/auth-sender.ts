import { ENVIRONMENT_VARIABLES } from "../configurations/config";
import sendEmail from "../configurations/handlebars";
import transporter from "../configurations/transporter";
import { InternalServerError } from "../errors/InternalServerError";

export class UserEmails {
  public BlastSignupUser = async (data: any) => {
    const mailTransporter = transporter();
    try {
      await sendEmail({
        template: "signup",
        context: {
          ...data,
          subject: "Welcome to Cancer AI website",
        },
        to: data.email,
        from: ENVIRONMENT_VARIABLES.G_MAIL,
        subject: "Welcome to Cancer AI",
        transporter: mailTransporter,
      });
      console.log("Email sent successfully!");
    } catch (error: any) {
      console.error(error);
      throw new InternalServerError(error.message);
    }
  };

  public blastUserEmailVerificationTokenMessage = async (data: any, subject: string) => {
    const mailTransporter = transporter();
    try {
      await sendEmail({
        template: "email-verification-otp",
        context: {
          ...data,
        },
        to: data.email,
        from: ENVIRONMENT_VARIABLES.G_MAIL,
        subject: "Email Verification",
        transporter: mailTransporter,
      });
      console.log("Email sent successfully!");
    } catch (error: any) {
      console.error(error);
      throw new InternalServerError(error.message);
    }
  };
  public blastRenewUserTokenMessage = async (data: any, subject: string) => {
    const mailTransporter = transporter();
    try {
      await sendEmail({
        template: "renew-request-otp",
        context: {
          ...data,
        },
        to: data.email,
        from: ENVIRONMENT_VARIABLES.G_MAIL,
        subject: "One-Time Password (OTP)",
        transporter: mailTransporter,
      });
      console.log("Email sent successfully!");
    } catch (error: any) {
      console.error(error);
      throw new InternalServerError(error.message);
    }
  };
  public blastUserForgotTokenMessage = async (data: any, subject: string) => {
    const mailTransporter = transporter();
    try {
      await sendEmail({
        template: "forget-password",
        context: {
          ...data,
        },
        to: data.email,
        from: ENVIRONMENT_VARIABLES.G_MAIL,
        subject: "Password Reset",
        transporter: mailTransporter,
      });
      console.log("Email sent successfully!");
    } catch (error: any) {
      console.error(error);
      throw new InternalServerError(error.message);
    }
  };
}
