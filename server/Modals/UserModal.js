import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  categories: {
    type: Array,
    default: [
      { id: 1, name: "Food" },
      { id: 2, name: "Transportation" },
      { id: 3, name: "Shopping" },
      { id: 4, name: "Rent" },
      { id: 5, name: "Utilities" },
      { id: 6, name: "Others" },
    ],
  },
});

const User = mongoose.model("user", UserSchema);

export default User;
