const County = require("../models/County");

module.exports = {
    addCounty: async (req, res, next) => {
        const {county, description, imageUrl, region, popular} = req.body;

        try {

            const newCounty = new County({
                county,
                description,
                imageUrl,
                region,
                popular
            });

            await newCounty.save();

            res.status(201).json({status: true})
            
        } catch (error) {
            return next(error)
        }
    },

    addPlacesToCounty: async (req, res, next) => {

    },
    
    getCounties: async (req, res, next) => {
        try {
            
            const counties = await County.find({},{county: 1, _id:1, imageUrl: 1})

            res.status(200).json({counties})
        } catch (error) {
            
        }
    },

    getCounty: async (req, res, next) => {

    },
}