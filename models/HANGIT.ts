import mongoose from "mongoose";

// Create a Mongoose schema for HANGIT users
const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
});

const HANGITUsers = mongoose.model("users", UserSchema);

export default HANGITUsers;