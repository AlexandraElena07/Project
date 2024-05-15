const mongoose = require("mongoose");

const PlaceSchema = new mongoose.Schema({
    county_id: {type: String, require: true},
    description: {type: String, require: true},
    imageUrl: {type: String, require: true},
    location: {type: String, require: true},
    title: {type: String, require: true},
    rating: {type: Number, require: true},
    review: {type: Number, require: true},
    category: {type: String, require: true},
    latitude: {type: Number, require: true},
    longitude: {type: Number, require: true}
}, {timestamps: true});

module.exports = mongoose.model("Place", PlaceSchema);