const County = require("../models/County");

module.exports = {
    addCounty: async (req, res, next) => {
        const {county, description, imageUrl, videoId, popular} = req.body;

        try {

            const newCounty = new County({
                county,
                description,
                imageUrl,
                videoId,
                popular
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

            const index = county.popular.indexOf(placeId);

            if(index !== -1) {
                county.popular.splice(index, 1)
            } else {
                county.popular.push(placeId);
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
                path:'popular',
                select: 'county description imageUrl videoId'
            });

            res.status(200).json(county)
        } catch (error) {
            return next(error)
        }
    },
}