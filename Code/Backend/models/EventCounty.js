const mongoose = require("mongoose");

const EventCountySchema = new mongoose.Schema({
    event_id: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Event' },
    title: { type: String, required: true },
    description: { type: String },
    location: { type: String, required: true },
    date: { type: Date, required: true },
    timestart: { type: String, required: true },
    timeend: { type: String, required: true },
    type: { type: String, required: true, default: 'event' }
}, { timestamps: true });

    module.exports = mongoose.model("EventCounty", EventCountySchema);