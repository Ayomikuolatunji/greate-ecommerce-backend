import { NextFunction, Request, Response } from "express";
import crypto from "crypto";
import { ENVIRONMENT_VARIABLES } from "../configurations/config";
import prisma from "../database/PgDB";

class PaystackWebhookHandler {
  public async handleWebhook(req: Request, res: Response, next: NextFunction) {
    try {
      const hash = crypto
        .createHmac("sha512", ENVIRONMENT_VARIABLES.PAYSTACK_SECRET_KEY)
        .update(JSON.stringify(req.body))
        .digest("hex");
      if (hash === req.headers["x-paystack-signature"]) {
        const event = req.body;
        console.log(">>>> Received New Event>>>>>>:", event);
        if (event && event.event === "charge.success") {
          await prisma.transaction.create({
            data: {
              amount: event?.data?.amount / 100,
              userId: event.data.metadata?.userId,
              txref: event?.data?.reference,
              orderId: event.data.metadata?.orderId,
              status: "SUCCESS",
              paymentMethod: event?.data.channel.toUpperCase(),
            },
          });
        }
      }
      res.sendStatus(200);
    } catch (error) {
      next(error);
    }
  }
}

export default PaystackWebhookHandler;
