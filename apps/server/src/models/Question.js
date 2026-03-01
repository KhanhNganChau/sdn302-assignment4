const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const QuestionSchema = new Schema(
  {
    text: {
      type: String,
      required: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    options: {
      type: [String],
      required: true,
      validate: {
        validator: (v) => v.length >= 2,
        message: "A question must have at least 2 options",
      },
    },
    keywords: {
      type: [String],
      default: [],
    },
    correctAnswerIndex: {
      type: Number,
      required: true,
      validate: {
        validator: function (v) {
          return v >= 0 && v < this.options.length;
        },
        message: "correctAnswerIndex must match options array",
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Question", QuestionSchema);
