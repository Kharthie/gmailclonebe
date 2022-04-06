import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  firstname: String,
  lastname: String,
  email: String,
  password: String,
  phone: Number,
  username: String,
});

export default mongoose.model("users", userSchema);