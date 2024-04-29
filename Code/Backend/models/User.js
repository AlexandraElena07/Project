const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    username: {type: String, required: true}, 
    email: {type: String, required: true, unique: true}, 
    password: {type: String, required: true},
    profile: {type: String, default: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ30o3yandZCnr004Z9K0YUv0k5-OqluMRL9gI5IuSH9mQf85E1eDo8KUcqfA&s"},
})

module.exports = mongoose.model("User", UserSchema);
