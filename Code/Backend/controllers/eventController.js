const Event = require("../models/Event");
const EventCounty = require("../models/EventCounty")

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

    getEventCountyByEvent: async (req, res, next) => {
        const eventId = req.params.id; 
    
        try {
            const event = await EventCounty.find({event_id: eventId}, {createdAt:0, updatedAt: 0, _v: 0})

    
            if (!event) {
                return res.status(404).json({ message: "Event not found" });
            }
    
            console.log("Event Counties for the event:", event);
            res.status(200).json(event.events);
        } catch (error) {
            console.error('Error fetching Event Counties:', error);
            return res.status(500).json({ message: "Server error" });
        }
    }
    
    
}