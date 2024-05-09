const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    username: {type: String, required: true, unique: true}, 
    email: {type: String, required: true, unique: true}, 
    password: {type: String, required: true},
    profile: {type: String, default: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTbBa24AAg4zVSuUsL4hJnMC9s3DguLgeQmZA&usqp=CAU"},
    theme: {type: String, default: 'light'}
})

module.exports = mongoose.model("User", UserSchema);
 