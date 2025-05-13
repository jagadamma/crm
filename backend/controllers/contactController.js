const { Contact, Activity } = require('../models/contactmodel.js');
const { Op } = require('sequelize');

// Create a new contact
const createContact = async (req, res) => {
    try {
        const {
            firstName,
            lastName,
            email,
            companyName,
            companyWebsite,
            companySize,
            phoneNo,
            city,
            state,
            role,
            industryType,
            founderName,
            status,
            companyLinkedinUrl,
            linkedinProfileUrl,
            image,
            companyLocation
        } = req.body;

        // Create a new contact with firstName, lastName, city, and state
        const newContact = await Contact.create({
            firstName,
            lastName,
            email,
            companyName,
            companyWebsite,
            companySize,
            phoneNo,
            city,
            state,
            role,
            industryType,
            founderName,
            status,
            companyLinkedinUrl,
            linkedinProfileUrl,
            image,
            companyLocation
        });

        res.status(201).json({ message: 'Contact created successfully', contact: newContact });
    } catch (error) {
        console.error(error); // Log the error for debugging
        res.status(500).json({ message: 'Error creating contact', error: error.message });
    }
};

// Get all contacts
const getAllContacts = async (req, res) => {
    try {
        // Fetch all contacts from the database
        const contacts = await Contact.findAll();

        // Return the contacts in the response
        res.status(200).json({ message: 'Contacts fetched successfully', contacts });
    } catch (error) {
        console.error(error); // Log the error for debugging
        res.status(500).json({ message: 'Error fetching contacts', error: error.message });
    }
};

// Delete contact
const deleteContact = async (req, res) => {
    try {
        const { id } = req.params;

        const contact = await Contact.findByPk(id);

        if (!contact) {
            return res.status(404).json({ message: 'Contact not found' });
        }

        // Delete the contact
        await contact.destroy();

        // Return success response
        res.status(200).json({ message: 'Contact deleted successfully' });
    } catch (error) {
        console.error(error); // Log the error for debugging
        res.status(500).json({ message: 'Error deleting contact', error: error.message });
    }
};

// Get a single contact
const getContact = async (req, res) => {
    try {
        const { id } = req.params;

        const contact = await Contact.findByPk(id);

        if (!contact) {
            return res.status(404).json({ message: 'Contact not found' });
        }

        res.status(200).json({ message: 'Contact fetched successfully', contact });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching contact', error: error.message });
    }
};

// Edit a contact
const editContact = async (req, res) => {
    try {
        const { id } = req.params;

        const contact = await Contact.findByPk(id);

        if (!contact) {
            return res.status(404).json({ message: 'Contact not found' });
        }

        const {
            firstName,
            lastName,
            email,
            companyName,
            companyWebsite,
            companySize,
            phoneNo,
            city,
            state,
            role,
            industryType,
            founderName,
            status,
            companyLinkedinUrl,
            linkedinProfileUrl,
            image,
            companyLocation
        } = req.body;

        contact.firstName = firstName;
        contact.lastName = lastName;
        contact.email = email;
        contact.companyName = companyName;
        contact.companyWebsite = companyWebsite;
        contact.companySize = companySize;
        contact.phoneNo = phoneNo;
        contact.city = city;
        contact.state = state;
        contact.role = role;
        contact.industryType = industryType;
        contact.founderName = founderName;
        contact.status = status;
        contact.companyLinkedinUrl = companyLinkedinUrl;
        contact.linkedinProfileUrl = linkedinProfileUrl;
        contact.image = image;
        contact.companyLocation = companyLocation; 

        await contact.save();

        res.status(200).json({ message: 'Contact updated successfully', contact });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating contact', error: error.message });
    }
};

// Search Controller
const searchContact = async (req, res) => {
    try {
        const { query } = req.query;

        if (!query) {
            return res.status(400).json({ message: 'Search query is required' });
        }

        const regex = new RegExp(query, 'i');

        const contacts = await Contact.findAll({
            where: {
                [Op.or]: [
                    { firstName: { [Op.like]: `%${query}%` } },
                    { lastName: { [Op.like]: `%${query}%` } },
                    { email: { [Op.like]: `%${query}%` } },
                    { phoneNo: { [Op.like]: `%${query}%` } },
                    { role: { [Op.like]: `%${query}%` } },
                    { companyName: { [Op.like]: `%${query}%` } }
                ]
            }
        });

        res.status(200).json({ message: 'Contacts searched successfully', contacts });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error searching contact', error: error.message });
    }
};

// Sort Contact
const sortContact = async (req, res) => {
    const { sortBy } = req.query;
    let order = [];

    if (sortBy === 'name') {
        order = [['firstName', 'ASC']]; // Sort by firstName
    } else if (sortBy === 'date') {
        order = [['createdAt', 'DESC']];
    }

    try {
        const contacts = await Contact.findAll({ order });
        res.json({ contacts });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching contacts' });
    }
};

// Get Interested Contacts
const getInterestedContacts = async (req, res) => {
    try {
        const contacts = await Contact.findAll({
            where: { status: 'Interested' }
        });

        res.status(200).json({ message: 'Interested contacts fetched successfully', contacts });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching interested contacts', error: error.message });
    }
};

// Add Activity
const addActivityToContact = async (req, res) => {
    const { id } = req.params;
    const { activityType, description } = req.body;

    try {
        const contact = await Contact.findByPk(id);

        if (!contact) {
            return res.status(404).json({ message: 'Contact not found' });
        }

        const newActivity = await Activity.create({
            activityType,
            description,
            contactId: id
        });

        console.log(newActivity);

        res.status(200).json({ message: 'Activity added successfully' });
    } catch (error) {
        console.error('Error adding activity:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Delete Activity
const deleteActivity = async (req, res) => {
    try {
        const { id, activityId } = req.params;

        const contact = await Contact.findByPk(id);
        if (!contact) {
            return res.status(404).json({ message: 'Contact not found' });
        }

        const activity = await Activity.findByPk(activityId);
        if (!activity) {
            return res.status(404).json({ message: 'Activity not found' });
        }

        await activity.destroy();
        res.status(200).json({ message: 'Activity deleted successfully' });
    } catch (error) {
        console.error('Error deleting activity:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Get all activities of a particular contact
const getContactActivities = async (req, res) => {
    try {
        const { id } = req.params;

        const contact = await Contact.findByPk(id);

        if (!contact) {
            return res.status(404).json({ message: 'Contact not found' });
        }

        const activities = await Activity.findAll({
            where: { contactId: id },
        });

        res.status(200).json({ message: 'Activities fetched successfully', activities });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching activities', error: error.message });
    }
};

module.exports = {
    createContact,
    getAllContacts,
    deleteContact,
    editContact,
    getContact,
    searchContact,
    sortContact,
    getInterestedContacts,
    addActivityToContact,
    deleteActivity,
    getContactActivities
};
