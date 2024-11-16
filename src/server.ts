import { PrismaClient } from "@prisma/client";
import { app } from "./app";
import prisma from "./database/PgDB";
import { ENVIRONMENT_VARIABLES } from "./configurations/config";

class CreateDBConnect {
  db: PrismaClient;
  constructor() {
    this.db = prisma;
  }
  async connect() {
    try {
      await this.db.$connect();
      console.log("Connected to database successfully");
      app.listen(ENVIRONMENT_VARIABLES.PORT, () =>
        console.log(`Server is running on port ${ENVIRONMENT_VARIABLES.PORT}`)
      );

    } catch (error: any) {
      console.error("Failed to connect to database", error.message);
    }
  }
  async disconnect() {
    await this.db.$disconnect();
  }
}
const dbConnect = new CreateDBConnect();
dbConnect.connect();
