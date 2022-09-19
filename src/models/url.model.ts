import { Schema, model } from "mongoose";

interface iUrl {
  url: string;
  link: string;
}

const UrlSchema = new Schema<iUrl>({
  url: { type: String, required: true, trim: true },
  link: { type: String },
});

const Url = model<iUrl>("Url", UrlSchema);

UrlSchema.pre("save", (): void => {
  console.log("pre save");
});

export default Url;
