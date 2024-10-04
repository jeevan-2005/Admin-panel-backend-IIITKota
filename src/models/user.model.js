import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const emailRegexPattern = /^[a-zA-Z0-9._%+-]+@iiitkota\.ac\.in$/;

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter your name"],
    },
    email: {
      type: String,
      required: [true, "Please enter your email"],
      validate: {
        validator: function (value) {
          return emailRegexPattern.test(value);
        },
        message: "Please enter a valid email address",
      },
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minlength: [6, "Password must have atleast 6 characters"],
    },
    role: {
      type: String,
      default: "user",
      enum: ["user", "admin", "superAdmin"],
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.signAccessToken = function(){
    return jwt.sign({id: this._id}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: "1d"});
}

userSchema.methods.signRefreshToken = function(){
    return jwt.sign({id: this._id}, process.env.REFRESH_TOKEN_SECRET, {expiresIn: "7d"});
}

export const UserModel = mongoose.model("User", userSchema);
