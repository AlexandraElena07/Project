const ExhibitionCounty = require("../models/ExhibitionCounty")

module.exports = {
    addExhibitionCounty: async(req, res, next) => {
        const { event_id, description, location, title, start_date, end_date, type } = req.body;

        try {
            const newExhibitionCounty = new ExhibitionCounty({
                event_id, 
                description, 
                location, 
                title, 
                start_date,
                end_date,
                type
            })

            await newExhibitionCounty.save();

            res.status(201).json({status: true})
        } catch(error) {
            return next(error)
        }
    },

    getExhibitionsCounty: async(req, res, next) => {
        try {
            const exhibitionsCounty = await ExhibitionCounty.find({}, 'event_id description location title start_date end_date type')

            res.status(200).json({exhibitionsCounty})
        } catch (error) {
            return next(error)
        }
    },
    
    getExhibitionCounty: async(req, res, next) => {
        const exhibitionCountyId = req.params.id;

        try {
            const exhibitionCounty = await ExhibitionCounty.findById(exhibitionCountyId, {createdAt: 0, updatedAt: 0, _v: 0})

            if (!exhibitionCounty) {
                return res.status(404).json({ message: "Exhibition not found" });
            }

            res.status(200).json(exhibitionCounty)
        } catch (error) {
            return next(error)
        }
    },

    getExhibitionCountyByEvent: async (req, res, next) => {
        const eventId = req.params.id;
        //console.log("Looking for ExhibitionCounty with Exhibition ID:", eventId); 
    
        try {
            const exhibitionCounty = await ExhibitionCounty.find({event_id: eventId});
    
            if (exhibitionCounty.length === 0) {
                return res.status(200).json([])
            }
    
            return res.status(200).json(exhibitionCounty);
        } catch (error) {
            console.error("Error fetching ExhibitionCounty:", error); 
            return next(error);
        }
    }
    
}