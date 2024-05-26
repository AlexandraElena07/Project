const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema({
    username: {type: String, require: true},
    rating: {type: Number, require: true},
    reviewText: {type: String, require: true},
    date: {type: Date, default: Date.now}
});

const HotelSchema = new mongoose.Schema({
    county_id: {type: String, require: true},
    imageUrls: { type: [String], required: true },
    location: {type: String, require: true},
    title: {type: String, require: true},
    star: {type: Number, require: true},
    category: {type: String, require: true},
    latitude: {type: Number, require: true},
    longitude: {type: Number, require: true},
    mail: {type: String, require: true},
    phone: {type: String, require: true},
    adress: {type: String, require: true},
    website: {type: String, require: true},
    bookingsite: {type: String, require: true},
    reviews: [ReviewSchema]
}, {timestamps: true});

module.exports = mongoose.model("Hotel", HotelSchema);