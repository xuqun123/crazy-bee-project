const { model, Schema } = require("mongoose");

const UserSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    firstName: {
      type: String,
      required: false,
    },
    lastName: {
      type: String,
      required: false,
    },
    dob: {
      type: Date,
      required: false,
    },
    bio: {
      type: String,
      required: false,
    },
    walletAddresses: {
      type: [String],
      required: false,
    },
    avatarUrl: { type: String, required: false },
    bannerImageUrl: { type: String, required: false },
    emailVerified: {
      type: Boolean,
      required: true,
      default: false,
    },
    createdAt: { type: Date },
    updatedAt: { type: Date },
  },
  { timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" } }
);

UserSchema.methods.generatePasswordReset = function() {
  this.resetPasswordToken = crypto.randomBytes(20).toString('hex');
  this.resetPasswordExpires = Date.now() + 3600000; //expires in an hour
};

const UserModel = model("User", UserSchema);

module.exports = { UserModel, UserSchema };
