const EventCounty = require("../models/EventCounty")

module.exports = {
    addEventCounty: async(req, res, next) => {
        const { event_id, description, location, title, date, timestart, timeend, type } = req.body;

        try {
            const newEventCounty = new EventCounty({
                event_id, 
                description, 
                location, 
                title, 
                date,
                timestart,
                timeend,
                type
            })

            await newEventCounty.save();

            res.status(201).json({status: true})
        } catch(error) {
            return next(error)
        }
    },

    getEventsCounty: async(req, res, next) => {
        try {
            const eventsCounty = await EventCounty.find({}, 'event_id description location title date timestart timeend type')

            res.status(200).json({eventsCounty})
        } catch (error) {
            return next(error)
        }
    },
    
    getEventCounty: async(req, res, next) => {
        const eventCountyId = req.params.id;

        try {
            const eventCounty = await EventCounty.findById(eventCountyId, {createdAt: 0, updatedAt: 0, _v: 0})

            if (!eventCounty) {
                return res.status(404).json({ message: "Event not found" });
            }

            res.status(200).json(eventCounty)
        } catch (error) {
            return next(error)
        }
    },

    getEventCountyByCounty: async (req, res, next) => {
        const eventId = req.params.id;
        console.log("Looking for EventCounty with Event ID:", eventId); // Log the Event ID being searched
    
        try {
            const eventCounty = await EventCounty.find({event_id: eventId});
    
            console.log("Found EventCounty:", eventCounty); 
            if (eventCounty.length === 0) {
                return res.status(200).json([])
            }
    
            return res.status(200).json(eventCounty);
        } catch (error) {
            console.error("Error fetching EventCounty:", error); 
            return next(error);
        }
    }
    
}