import connectDb from "./services/database";
import cors from "cors";
import dotenv from "dotenv";
import express, { Application, NextFunction, Request, Response } from "express";
import httpError from "http-errors";
import helmet from "helmet";
import HttpException from "./interface/HttpException";
import logger from "./utils/logger";
import Url from "./models/url.model";
import validUrl from "valid-url";
import { Server, createServer } from "http";
import { nanoid } from "nanoid";
import { Logger } from "winston";

const app: Application = express();
const PORT = process.env.PORT || 8000;
const server: Server = createServer(app);

dotenv.config();

app.use(helmet());
app.use(cors({ origin: process.env.ORIGIN, optionsSuccessStatus: 200 }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", (req: Request, res: Response) => {
  res.status(200).send("url shortener");
});

app.post("/", async (req: Request, res: Response, next: NextFunction) => {
  const { url } = req.body;
  if (!url) throw new httpError.BadRequest("provide a valid url"); //if no url was recieved.

  try {
    if (!validUrl.isUri(url)) throw new httpError.BadRequest("invalid url"); //if url is not valid.
    let foundUrl = await Url.findOne({ longUrl: url });

    if (foundUrl) {
      return res.status(200).json({ url: foundUrl.shortUrl });
    } else {
      let urlCode = nanoid(8);
      const urlData = new Url({
        longUrl: url,
        shortUrl: `${process.env.BASE_URL}/${urlCode}`,
        urlCode,
      });
      // save link
      const resp = await urlData.save();
      return res.status(200).json({ url: resp.shortUrl });
    }
  } catch (error) {
    logger.error(`Generating url: ${error}`);
    next(error);
  }
});

app.get("/:code", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const url = await Url.findOne({ urlCode: req.params.code });
    if (!url) throw new httpError.NotFound("url not avaliable");
    return res.redirect(url.longUrl);
  } catch (error) {
    logger.error(`Accessing url: ${error}`);
    next(error);
  }
});

app.use("*", (req: Request, res: Response, next: NextFunction) => {
  next(new httpError.NotFound("This route doen't exist"));
});

app.use(
  (err: HttpException, req: Request, res: Response, next: NextFunction) => {
    res.status(err.status || 500);
    res.json({
      error: {
        status: err.status || 500,
        message: err.message,
      },
    });
  }
);

server.listen(PORT, async () => {
  await connectDb();
  logger.info("server started");
});
