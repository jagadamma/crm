const { Contact, Activity, checkUniqueEmailOrPhone } = require('../models/contactmodel.js');
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
            companyLocation,
            address
        } = req.body;


        // Authenticated user id gheto (JWT middleware ne set kelay asel)
        const createdBy = req.user.id;  // he aaplya auth middleware var depend karte

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
            companyLocation,
            address,
            createdBy  // user id save karat aahes
        });

        res.status(201).json({ message: 'Contact created successfully', contact: newContact });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating contact', error: error.message });
    }
};

// Get all contacts
// const getAllContacts = async (req, res) => {
//     try {
//         const contacts = await Contact.findAll();
//         res.status(200).json({ message: 'Contacts fetched successfully', contacts });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Error fetching contacts', error: error.message });
//     }
// };

const getMyContacts = async (req, res) => {
    try {
        const userId = req.user.id; // JWT middleware madhun milto
        const contacts = await Contact.findAll({
            where: { createdBy: userId }
        });

        res.status(200).json({ message: 'User-specific contacts fetched successfully', contacts });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching user-specific contacts', error: error.message });
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

        await contact.destroy();
        res.status(200).json({ message: 'Contact deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting contact', error: error.message });
    }
};

// Delete multiple contacts
const deleteMultipleContacts = async (req, res) => {
    try {
        const { ids } = req.body;
        if (!Array.isArray(ids) || ids.length === 0) {
            return res.status(400).json({ message: 'No contact IDs provided' });
        }

        const deleted = await Contact.destroy({
            where: { id: ids }
        });

        res.status(200).json({ message: `${deleted} contact(s) deleted successfully` });
    } catch (error) {
        console.error('Error deleting multiple contacts:', error);
        res.status(500).json({ message: 'Error deleting contacts', error: error.message });
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
            companyLocation,
            address
        } = req.body;

        if (!phoneNo) {
            return res.status(400).json({ error: "Phone number is required" });
        }

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
        contact.address = address;

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

        const contacts = await Contact.findAll({
            where: {
                [Op.or]: [
                    { firstName: { [Op.like]: `%${query}%` } },
                    { lastName: { [Op.like]: `%${query}%` } },
                    { email: { [Op.like]: `%${query}%` } },
                    { phoneNo: { [Op.like]: `%${query}%` } },
                    { role: { [Op.like]: `%${query}%` } },
                    { companyName: { [Op.like]: `%${query}%` } },
                    { address: { [Op.like]: `%${query}%` } }
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
        order = [['firstName', 'ASC']];
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

        await Activity.create({
            activityType,
            description,
            contactId: id
        });

        res.status(200).json({ message: 'Activity added successfully' });
    } catch (error) {
        console.error('Error adding activity:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
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
        res.status(500).json({ message: 'Internal server error', error: error.message });
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

const checkUnique = async (req, res) => {
    try {
        const { email, phoneNo, excludeId } = req.query;

        const contact = await checkUniqueEmailOrPhone(email, phoneNo, excludeId);

        if (contact) {
            return res.status(409).json({ exists: true });
        }

        return res.json({ exists: false });
    } catch (error) {
        console.error("Error in uniqueness check:", error);
        return res.status(500).json({ message: "Server Error", error: error.message });
    }
};



module.exports = {
    createContact,
    // getAllContacts,
    deleteContact,
    deleteMultipleContacts,
    editContact,
    getContact,
    searchContact,
    sortContact,
    getInterestedContacts,
    addActivityToContact,
    deleteActivity,
    getContactActivities,
    checkUnique,
    getMyContacts,
};