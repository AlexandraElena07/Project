const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema({
    username: {type: String, require: true},
    rating: {type: Number, require: true},
    reviewText: {type: String, require: true},
    date: {type: Date, default: Date.now}
});

const PlaceSchema = new mongoose.Schema({
    county_id: {type: String, require: true},
    description: {type: String, require: true},
    imageUrls: { type: [String], required: true },
    location: {type: String, require: true},
    title: {type: String, require: true},
    category: {type: String, require: true},
    latitude: {type: Number, require: true},
    longitude: {type: Number, require: true},
    program: {type: String, require: true},
    phone: {type: String, require: true},
    adress: {type: String, require: true},
    price: {type: String, require: true},
    type: { type: String, required: true, default: 'place' },
    reviews: [ReviewSchema]
}, {timestamps: true});

module.exports = mongoose.model("Place", PlaceSchema);