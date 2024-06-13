const mongoose = require("mongoose");

const favoriteSchema = new mongoose.Schema({
  _id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
  },
  type: {
      type: String,
      required: true,
      enum: ['Place', 'County', 'Hotel'],
  },
  countyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'County', // Referință la schema County
      required: true,
  }
});

const UserSchema = new mongoose.Schema({
    username: {type: String, required: true, unique: true}, 
    email: {type: String, required: true, unique: true}, 
    password: {type: String, required: true},
    profile: {type: String, default: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTbBa24AAg4zVSuUsL4hJnMC9s3DguLgeQmZA&usqp=CAU"},
    theme: {type: String, default: 'light'},
    role: { type: String, default: 'user' },
    favorites: [favoriteSchema]
});

module.exports = mongoose.model("User", UserSchema);

