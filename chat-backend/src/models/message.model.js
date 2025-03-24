import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
      validate: {
        validator: function (value) {
          return value || this.image; // Ensure at least text or image is present
        },
        message: "Message must contain either text or an image",
      },
    },
    image: {
      type: String,
      validate: {
        validator: function (value) {
          return value || this.text;
        },
        message: "Message must contain either text or an image",
      },
    },
    status: {
      type: String,
      enum: ["sent", "read"],
      default: "sent",
    },
  },
  { timestamps: true }
);

const Message = mongoose.model("Message", messageSchema);

export default Message;
