const mongoose = require("mongoose");

const ExhibitionCountySchema = new mongoose.Schema({
    event_id: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Event' },
    title: { type: String, required: true },
    description: { type: String},
    location: { type: String, required: true },
    start_date: { type: Date, required: true },
    end_date: { type: Date, required: true },
    type: { type: String, required: true, default: 'exhibition' }
}, { timestamps: true });

module.exports = mongoose.model("ExhibitionCounty", ExhibitionCountySchema);