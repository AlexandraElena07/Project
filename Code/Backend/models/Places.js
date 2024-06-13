const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    username: {type: String, required: true},
    profile: {type: String},
    rating: {type: Number, required: true},
    reviewText: {type: String, required: true},
    date: {type: Date, default: Date.now}
});

const PlaceSchema = new mongoose.Schema({
    county_id: { type: mongoose.Schema.Types.ObjectId, ref: 'County', required: true},
    description: {type: String, required: true},
    imageUrls: { type: [String], required: true },
    location: {type: String, required: true},
    title: {type: String, required: true},
    category: {type: String, required: true},
    latitude: {type: Number, required: true},
    longitude: {type: Number, required: true},
    program: {type: String},
    phone: {type: String},
    adress: {type: String},
    price: {type: String}, 
    type: { type: String, required: true, default: 'place' },
    reviews: [ReviewSchema]
}, {timestamps: true});


module.exports = mongoose.model("Place", PlaceSchema);