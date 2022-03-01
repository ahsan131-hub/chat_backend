const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const UserSchema = new Schema({
  userName: {
    type: "string",
    required: true,
  },
  password: {
    type: "string",
    required: true,
  },
  email: {
    type: "string",
    required: true,
    unique: true,
    lowercase: true,
    required: "Email is Required",
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/],
  },
});
//employees : [{ type : Schema.Types.ObjectId, ref : "Employee"}]
module.exports = mongoose.model("User", UserSchema);
