const mongoose = require("mongoose");

const CountySchema = new mongoose.Schema({
    county: {type: String, require: true},
    description: {type: String, require: true},
    imageUrl: {type: String, require: true},
    videoId: {type: String, require: true},
    attraction: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Place"
        }
    ],
    hotel: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Hotel"
        }
    ],
    event: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Event"
        }
    ]
}, {timestamps: true});
 
module.exports = mongoose.model("County", CountySchema);