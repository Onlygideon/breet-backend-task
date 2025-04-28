import mongoose from "mongoose";

const UserModel = new mongoose.Schema(
  {
    username: {
      type: String,
      index: true,
      unique: true,
      sparse: true,
      required: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    salt: {
      type: String,
      required: true,
    },
    userType: {
      type: String,
      required: true,
      enum: ["individual", "business"],
      default: "individual",
    },
    createdAt: {
      type: Date,
      index: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.password;
        delete ret.salt;
        delete ret.__v;
      },
    },
  }
);

export default mongoose.model("User", UserModel);
