import express, { Application } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import compression from "compression";
import responseTime from "response-time";
import requestHeaders from "./middlewares/handlers/requestHeaders";
import errorHandler from "./middlewares/handlers/requestErrorHandler";
import { pageNotFound } from "./middlewares/errors/404Page";

import { Winston } from "./middlewares/errors/winstonErrorLogger";
import v1Api from "./routes/v1Route";
import swaggerDocument from "../swagger/swagger.json";

const app: Application = express();

// Standard Express middlewares
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({ credentials: true, origin: "*" }));
app.use(compression());
app.use(requestHeaders);
app.use(responseTime());

app.use("/api", v1Api);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get("/logs", Winston.setupServerErrorRoute);
app.use(pageNotFound);
app.use(Winston.ErrorLogger());
app.use(errorHandler);

export { app };
