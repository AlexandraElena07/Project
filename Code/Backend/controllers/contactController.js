const Contact = require("../models/Contact");

module.exports = {
    createContact: async (req, res, next) => {
        const { body, user } = req;

        if (!user || !user.id) {
            return res.status(401).json({ message: "Unauthorized: No valid user ID" });
        }
        const contactData = {
            user_id: user.id,
            email: body.email,
            feedback: body.feedback
        };
        try {
            const newContact = new Contact(contactData);
            await newContact.save();
            res.status(201).json({ success: true, message: "Feedback was sent successfully." });
        } catch (error) {
            return next(error);
        }
    },

    getContact : async(req, res, next) => {
        try {
            const contacts = await Contact.find();
            res.json(contacts);
        } catch (error) {
            console.error('Failed to retrieve contacts:', error);
            res.status(500).json({ message: "Failed to retrieve contacts" });
        }
    }
}