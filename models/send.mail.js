import mongoose from "mongoose";

const mailSchema = mongoose.Schema({
  from: String,
  to: String,
  username: String,
  subject: String,
  message: String,
  date: String,
  mailid: Number,
});

export default mongoose.model("sendmail", mailSchema);
