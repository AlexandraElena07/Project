const Event = require("../models/Event");
const EventCounty = require("../models/EventCounty")
const County = require('../models/County')
 
module.exports = {
    addEvent: async (req, res, next) => {
        const {county_id, county_name, title, imageUrl, start_date, end_date, events, exhibitions} = req.body;

        try {

            const newEvent = new Event({
                county_id,
                county_name,
                title,
                imageUrl,
                start_date,
                end_date,
                events,
                exhibitions 
            });

            await newEvent.save();

            // Adăugarea ID-ului locației în array-ul de atracții al județului corespunzător
            const county = await County.findById(county_id);
            if (county) {
                county.event.push(newEvent._id);  // Adaugă ID-ul locației la atracții
                await county.save();
            } else {
                // Județul nu a fost găsit
                return res.status(404).json({status: false, message: "County not found"});
            }    

            res.status(201).json({status: true})
            
        } catch (error) {
            return next(error)
        }
    },
    getEvents: async(req, res, next) => {
        try {
            const events = await Event.find({}, '_id county_id county_name title imageUrl start_date end_date events exhibitions')

            res.status(200).json({events})
        } catch (error) {
            return next(error)
        }
    },

    getEvent: async(req, res, next) => {
        const eventId = req.params.id;

        try {
            const event = await Event.findById(eventId, {createdAt: 0, updatedAt: 0, _v: 0})

            if (!event) {
                return res.status(404).json({ message: "Event not found" });
            }

            res.status(200).json(event)
        } catch (error) {
            return next(error)
        }
    },

    getEventsByCounty: async (req, res, next) => {
        const countyId = req.params.id;

        try {
            const events = await Event.find({county_id: countyId}, {createdAt:0, updatedAt: 0, _v: 0})

            if(events.length === 0) {
                return res.status(200).json([])
            }


            return res.status(200).json(events)
        } catch(error) {
            return next(error)
        }
    },    
    
}