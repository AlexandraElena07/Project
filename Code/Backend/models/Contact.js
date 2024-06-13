const mongoose = require("mongoose");

const ContactSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    email: {type: String, required: true}, 
    feedback: {type: String, required: true}
})

module.exports = mongoose.model("Contact", ContactSchema); 