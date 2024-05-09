const Contact = require("../models/Contact");

const CryptoJS = require('crypto-js');
const jwt = require("jsonwebtoken");

module.exports = {
    createContact : async (req, res, next) => {
        const newContact = new Contact({ 
            email: req.body.email, 
            feedback: req.body.feedback 
        });

        try {
            await newContact.save();

            res.status(201).json({ success: true, message: "Feedback was send" });
        } catch (error) {
            return next(error)
        }
    }
}
