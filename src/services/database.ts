import { connect } from "mongoose";
import { connected } from "process";
import logger from "../utils/logger";

const connectDb = async () => {
  await connect("mongodb://localhost:27017/url-shortener")
    .then(() => {
      logger.info("database connected");
    })
    .catch((err) => {
      logger.error("error", { message: err });
    });
};

export default connectDb;
