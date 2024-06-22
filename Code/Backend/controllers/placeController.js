const Place = require("../models/Places")
const County = require("../models/County")

module.exports = {
    addPlaces: async (req, res, next) => {
        const { county_id, description, imageUrls, location, title, latitude, longitude, category, program, phone, adress, price } = req.body;

        try {
            const newPlace = new Place({
                county_id,
                description,
                imageUrls,
                location,
                title,
                category,
                latitude,
                longitude,
                program,
                phone,
                adress,
                price
            })
            const savedPlace = await newPlace.save();
            const county = await County.findById(county_id);
            if (county) {
                county.attraction.push(savedPlace._id);
                await county.save();
            } else {
                return res.status(404).json({ status: false, message: "County not found" });
            }
            res.status(201).json({ status: true })
        } catch (error) {
            return next(error)
        }
    },

    addReview: async (req, res, next) => {
        const placeId = req.params.id;
        const user_id = req.user.id;
        const { rating, reviewText, profile } = req.body;

        try {
            const place = await Place.findById(placeId, { createdAt: 0, updatedAt: 0, _v: 0 })
            if (!place) {
                return res.status(404).json({ message: "Place not found" });
            }
            const newReview = {
                user_id: user_id,
                username: req.user.username,
                profile,
                rating,
                reviewText
            };
            place.reviews.push(newReview);
            await place.save();
            res.status(201).json({ status: true, message: "Review added successfully" });
        } catch (error) {
            return next(error);
        }
    },

    getPlaces: async (req, res, next) => {
        try {
            const places = await Place.find({}).populate('reviews');

            const placesWithRatings = places.map(place => {
                const totalRatings = place.reviews.reduce((sum, review) => sum + review.rating, 0);
                const averageRating = place.reviews.length > 0 ? totalRatings / place.reviews.length : 0;

                return {
                    ...place.toObject(),
                    averageRating
                };
            });
            res.status(200).json({ places: placesWithRatings });
        } catch (error) {
            return next(error)
        }
    },

    getPlace: async (req, res, next) => {
        const placeId = req.params.id;

        try {
            const place = await Place.findById(placeId, { createdAt: 0, updatedAt: 0, _v: 0 })
            if (!place) {
                return res.status(404).json({ message: "Place not found" });
            }
            const totalRatings = place.reviews.reduce((sum, review) => sum + review.rating, 0);
            const averageRating = place.reviews.length > 0 ? totalRatings / place.reviews.length : 0;
            res.status(200).json({ place, averageRating })
        } catch (error) {
            return next(error)
        }
    },

    getPlacesByCounty: async (req, res, next) => {
        const countyId = req.params.id;

        try {
            const places = await Place.find({ county_id: countyId }, { createdAt: 0, updatedAt: 0, __v: 0 });
            if (places.length === 0) {
                return res.status(200).json([]);
            }

            const placesWithRating = places.map(place => {
                const totalRatings = place.reviews.reduce((sum, review) => sum + review.rating, 0);
                const averageRating = place.reviews.length > 0 ? totalRatings / place.reviews.length : 0;
                return { ...place._doc, averageRating };
            });

            return res.status(200).json({ places: placesWithRating });
        } catch (error) {
            return next(error);
        }
    },

    getTopPlaces: async (req, res, next) => {
        try {
            const places = await Place.find({}).populate('reviews');
            const placesWithRatings = places.map(place => {
                const totalRatings = place.reviews.reduce((sum, review) => sum + review.rating, 0);
                const averageRating = place.reviews.length > 0 ? totalRatings / place.reviews.length : 0;
                return { ...place.toObject(), averageRating };
            }).sort((a, b) => b.averageRating - a.averageRating).slice(0, 5);

            //console.log('Top places fetched:', placesWithRatings);
            res.status(200).json(placesWithRatings);
        } catch (error) {
            console.error('Error fetching top places:', error);
            return next(error);
        }
    },
}

