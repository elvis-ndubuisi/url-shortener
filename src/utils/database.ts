import { connect } from "mongoose";

const connectDb = async () => {
  await connect("mongodb://localhost:27017/url-shortener");
};

export default connectDb;
