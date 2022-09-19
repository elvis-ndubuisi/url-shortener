import connectDb from "./utils/database";
import express, { Application, NextFunction, Request, Response } from "express";
import httpError from "http-errors";
import helmet from "helmet";
import logger from "./utils/logger";
import { Server } from "http";
import Url from "./models/url.model";

const app: Application = express();
const PORT = process.env.PORT || 8000;

connectDb();

app.use(helmet());

app.get("/", (req: Request, res: Response) => {
  res.status(200).send("working");
});

app.post("/", (req: Request, res: Response, next: NextFunction) => {
  try {
    const { url } = req.body;
  } catch (error) {
    next(error);
  }
});

app.use((req: Request, res: Response, next: NextFunction) => {});

const server: Server = app.listen(PORT, () => {
  logger.info("server started");
});
