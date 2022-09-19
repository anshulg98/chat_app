const { number, boolean } = require('joi');
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Token = require("./token");
const { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } = process.env;
console.log(ACCESS_TOKEN_SECRET)

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    min: 3,
    max: 20,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    max: 50,
  },
  password: {
    type: String,
    required: true,
    min: 8,
  },
  isAvatarImageSet: {
    type: Boolean,
    default: false,
  },
  avatarImage: {
    type: String,
    default: "",
  },

  admin:{
    type: Boolean,
    default: false,
},
isOnline:{
    type: Boolean,
    default: false
}
});

userSchema.methods = {
  createAccessToken: async function () {
    try {
      let { _id, username } = this;
      let accessToken = jwt.sign(
        { user: { _id, username } },
        ACCESS_TOKEN_SECRET,
        {
          expiresIn: "10m",
        }
      );
      return accessToken;
    } catch (error) {
      console.error(error);
      return;
    }
  },
  createRefreshToken: async function () {
    try {
      let { _id, username } = this;
      let refreshToken = jwt.sign(
        { user: { _id, username } },
        REFRESH_TOKEN_SECRET,
        {
          expiresIn: "1d",
        }
      );

      await new Token({ token: refreshToken }).save();
      return refreshToken;
    } catch (error) {
      console.error(error);
      return;
    }
  },
};

//pre save hook to hash password before saving user into the database:
userSchema.pre("save", async function (next) {
  try {
    const salt = await bcrypt.genSalt(10); // generate hash salt of 12 rounds
    let hashedPassword = await bcrypt.hash(this.password, salt); // hash the current user's password
    this.password = hashedPassword;
  } catch (error) {
    console.error(error);
  }
  return next();
});

//module.exports = mongoose.model("User", userSchema);

module.exports = mongoose.model("Users", userSchema);
