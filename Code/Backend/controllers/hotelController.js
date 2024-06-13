const Hotel = require("../models/Hotel")
const County = require("../models/County")

module.exports = {
    addHotels: async(req, res, next) => {
        const { county_id, imageUrls, location, title, latitude, longitude, category, mail, phone, adress, website, bookingsite } = req.body;

        try {
            const newHotel = new Hotel({
                county_id,
                imageUrls, 
                location, 
                title, 
                category, 
                latitude, 
                longitude,
                mail,
                phone,
                adress,
                website,
                bookingsite
            })

            await newHotel.save();

            // Adăugarea ID-ului locației în array-ul de atracții al județului corespunzător
            const county = await County.findById(county_id);
            if (county) {
                county.hotel.push(newHotel._id);  // Adaugă ID-ul locației la atracții
                await county.save();
            } else {
                // Județul nu a fost găsit
                return res.status(404).json({status: false, message: "County not found"});
            }    

            res.status(201).json({status: true})
        } catch(error) {
            return next(error)
        }
    },

    addReview: async (req, res, next) => {
        const hotelId = req.params.id;
        const user_id = req.user.id;
        const { rating, reviewText, profile } = req.body;

        try {
            const hotel = await Hotel.findById(hotelId, {createdAt: 0, updatedAt: 0, _v: 0})

            if (!hotel) {
                return res.status(404).json({ message: "Hotel not found" });
            }

            const newReview = {
                user_id: user_id, 
                username: req.user.username, 
                profile,
                rating,
                reviewText
            };

            hotel.reviews.push(newReview);
            await hotel.save();

            res.status(201).json({ status: true, message: "Review added successfully" });
        } catch (error) {
            return next(error);
        }
    },

    getHotels: async(req, res, next) => {
        try {
            const hotels = await Hotel.find({}, '_id county_id imageUrls location title category latitude longitude mail phone adress website bookingsite reviews')

            res.status(200).json({hotels})
        } catch (error) {
            return next(error)
        }
    },

    getHotel: async(req, res, next) => {
        const hotelId = req.params.id;

        try {
            const hotel = await Hotel.findById(hotelId, {createdAt: 0, updatedAt: 0, _v: 0})

            if (!hotel) {
                return res.status(404).json({ message: "Hotel not found" });
            }

            const totalRatings = hotel.reviews.reduce((sum, review) => sum + review.rating, 0);
            const averageRating = hotel.reviews.length > 0 ? totalRatings / hotel.reviews.length : 0;

            res.status(200).json({hotel, averageRating})
        } catch (error) {
            return next(error)
        }
    },

    getHotelsByCounty: async (req, res, next) => {
        const countyId = req.params.id;

        try {
            const hotels = await Hotel.find({county_id: countyId}, {createdAt:0, updatedAt: 0, _v: 0})

            if(hotels.length === 0) {
                return res.status(200).json([])
            }
            const hotelsWithRating = hotels.map(hotel => {
                const totalRatings = hotel.reviews.reduce((sum, review) => sum + review.rating, 0);
                const averageRating = hotel.reviews.length > 0 ? totalRatings / hotel.reviews.length : 0;
                return { ...hotel._doc, averageRating }; 
            });
            return res.status(200).json({ hotels: hotelsWithRating })
        } catch(error) {
            return next(error)
        }
    },

    getTopHotels: async (req, res, next) => {
       //console.log('Fetching top hotels...');
        try {
            const hotels = await Hotel.find({}).populate('reviews');
    
            // Calculul averageRating pentru fiecare locație și sortarea acestora
            const hotelsWithRatings = hotels.map(hotel => {
                const totalRatings = hotel.reviews.reduce((sum, review) => sum + review.rating, 0);
                const averageRating = hotel.reviews.length > 0 ? totalRatings / hotel.reviews.length : 0;
                return { ...hotel.toObject(), averageRating }; // Adaugă averageRating la fiecare locație
            }).sort((a, b) => b.averageRating - a.averageRating).slice(0, 5); // Sortează descrescător după averageRating și limitează la primele 3
    
            //console.log('Top hotels fetched:', hotelsWithRatings);
            res.status(200).json(hotelsWithRatings);
        } catch (error) {
            console.error('Error fetching top hotels:', error);
            return next(error);
        }
    },  

    
}