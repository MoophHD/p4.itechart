const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserModel = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  jobPosition: { type: String },
  jobExperience: { type: String },
  techStack: { type: String },

  score: { type: Number, default: 0 },
  answers: [{ type: Schema.Types.ObjectId, ref: "answer" }],
  questions: [{ type: Schema.Types.ObjectId, ref: "question" }],
});

module.exports = mongoose.model("user", UserModel);