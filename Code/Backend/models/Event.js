const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema({
    county_id: { type: mongoose.Schema.Types.ObjectId, ref: 'County', required: true },
    title: { type: String, required: true },
    imageUrl: { type: String, required: true },
    start_date: { type: Date, required: true },
    end_date: { type: Date, required: true },
    county_name: { type: String, required: true },
    events: [{

        type: mongoose.Schema.Types.ObjectId,
        ref: "EventCounty"
        
    }],
    exhibitions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "ExhibitionCounty"
    }],
}, { timestamps: true });

module.exports = mongoose.model("Event", EventSchema);
