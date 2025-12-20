import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, default: "" },
  bio: { type: String, default: "" },
   profileImage: { type: String, default: "" } ,
   notifications: { type: Boolean, default: true }

});

export default mongoose.model("User", userSchema);
