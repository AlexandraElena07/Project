const County = require("../models/County");

module.exports = {
    addCounty: async (req, res, next) => {
        const {county, description, imageUrl, videoId, attraction, hotel, event} = req.body;

        try {
            const newCounty = new County({
                county,
                description,
                imageUrl,
                videoId,
                attraction,
                hotel,
                event
            });

            await newCounty.save();

            res.status(201).json({status: true})
        } catch (error) {
            return next(error)
        }
    },

    addPlacesToCounty: async (req, res, next) => {
        const {countyId, placeId} = req.body;

        try {
            const county = await County.findById(countyId);

            if(!county) {
                return res.status(404).json({message: "County not found"})
            }

            const index = county.attraction.indexOf(placeId);

            if(index !== -1) {
                county.attraction.splice(index, 1)
            } else {
                county.attraction.push(placeId);
            }

            await county.save();

            res.status(200).json({status: true})
        } catch (error) {
            return next(error)
        }
 
    },

    addHotelsToCounty: async (req, res, next) => {
        const {countyId, hotelId} = req.body;

        try {
            const county = await County.findById(countyId);

            if(!county) {
                return res.status(404).json({message: "County not found"})
            }

            const index = county.hotel.indexOf(placeId);

            if(index !== -1) {
                county.hotel.splice(index, 1)
            } else {
                county.hotel.push(hotelId);
            }

            await county.save();

            res.status(200).json({status: true})
        } catch (error) {
            return next(error)
        }
 
    },

    addEventsToCounty: async (req, res, next) => {
        const {countyId, eventId} = req.body;

        try {
            const county = await Event.findById(eventId);

            if(!county) {
                return res.status(404).json({message: "County not found"})
            }

            const index = county.event.indexOf(eventId);
            
            if(index !== -1) {
                county.event.splice(index, 1)
            } else {
                county.event.push(eventId);
            }

            await county.save();

            res.status(200).json({status: true})
        } catch (error) {
            return next(error)
        }
    },
    
    getCounties: async (req, res, next) => {
        try {     
            const counties = await County.find({},{county: 1, _id:1, imageUrl: 1, description: 1, videoId: 1})

            res.status(200).json({counties})
        } catch (error) {
            return next(error);
        }
    },

    getCounty: async (req, res, next) => {
        const countyId = req.params.id;
        try {
            const county = await County.findById(countyId, {createdAt: 0, updatedAt: 0, _v: 0})
            .populate({
                path:'attraction',
                select: 'description imageUrls location title category latitude longitude program phone adress price reviews'
            })
            .populate({
                path:'hotel',
                select: 'imageUrls location title category latitude mail program phone adress website bookingsite reviews'
            })
            .populate({
                path:'event',
                select: 'title start_date end_date'
            });

            res.status(200).json(county)
        } catch (error) {
            return next(error)
        }
    },
}