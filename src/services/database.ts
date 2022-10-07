import { connect } from "mongoose";
import logger from "../utils/logger";

const connectDb = async () => {
  await connect(`${process.env.DB_URI}`, { dbName: "UrlShortener" })
    .then(() => {
      logger.info("database connected");
    })
    .catch((err) => {
      logger.error("error", { message: err });
    });
};

export default connectDb;
