import { Schema, model } from "mongoose";

interface iUrl {
  longUrl: string; //actual url
  shortUrl: string; // short url
  urlCode: string; //generated code
}

const UrlSchema = new Schema<iUrl>({
  longUrl: { type: String, required: true, trim: true },
  shortUrl: { type: String },
  urlCode: { type: String },
});

const Url = model<iUrl>("Url", UrlSchema);

UrlSchema.pre("save", async (next): Promise<void> => {
  console.log(this);
  next();
});

export default Url;
