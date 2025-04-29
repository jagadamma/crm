const {Contact, Activity} = require('../models/contactmodel.js'); // Import the Contact model
const { Op } = require('sequelize');

// Create a new contact
const createContact = async (req, res) => {
    try {
        const {
            fullName,
            email,
            companyName,
            companyWebsite,
            companySize,
            phoneNo,
            companyLocation,
            role,
            industryType,
            founderName,
            status,
            companyLinkedinUrl,
            linkedinProfileUrl,
            image
        } = req.body;


        // Create a new contact
        const newContact = await Contact.create({
            fullName,
            email,
            companyName,
            companyWebsite,
            companySize,
            phoneNo,
            companyLocation,
            role,
            industryType,
            founderName,
            status,
            companyLinkedinUrl,
            linkedinProfileUrl,
            image
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
        const { id } = req.params; // Extract the contact ID from the request parameters

        // Find the contact by ID
        const contact = await Contact.findByPk(id);
        

        // Check if the contact exists
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
        const { id } = req.params; // Extract the contact ID from the request parameters

        // Find the contact by ID
        const contact = await Contact.findByPk(id);

        // Check if the contact exists
        if (!contact) {
            return res.status(404).json({ message: 'Contact not found' });
        }

        // Return the contact in the response
        res.status(200).json({ message: 'Contact fetched successfully', contact });
    } catch (error) {
        console.error(error); // Log the error for debugging
        res.status(500).json({ message: 'Error fetching contact', error: error.message });
    }
};

// Edit a contact

const editContact = async (req, res) => {
    try {
        const { id } = req.params; // Extract the contact ID from the request parameters

        // Find the contact by ID
        const contact = await Contact.findByPk(id);

        // Check if the contact exists
        if (!contact) {
            return res.status(404).json({ message: 'Contact not found' });
        }

        // Update the contact with the provided fields
        const {
            fullName,
            email,
            companyName,
            companyWebsite,
            companySize,
            phoneNo,
            companyLocation,
            role,
            industryType,
            founderName,
            status,
            companyLinkedinUrl,
            linkedinProfileUrl,
            image
        } = req.body;

        // Update fields directly
        contact.fullName = fullName;
        contact.email = email;
        contact.companyName = companyName;
        contact.companyWebsite = companyWebsite;
        contact.companySize = companySize;
        contact.phoneNo = phoneNo;
        contact.companyLocation = companyLocation;
        contact.role = role;
        contact.industryType = industryType;
        contact.founderName = founderName;
        contact.status = status;
        contact.companyLinkedinUrl = companyLinkedinUrl;
        contact.linkedinProfileUrl = linkedinProfileUrl;
        contact.image = image;

        // Save the updated contact to the database
        await contact.save();

        // Return success response
        res.status(200).json({ message: 'Contact updated successfully', contact });
    } catch (error) {
        console.error(error); // Log the error for debugging
        res.status(500).json({ message: 'Error updating contact', error: error.message });
    }
};
// Search Controller
const searchContact = async (req, res) => {
    try {
        const { query } = req.query; // Extract the search query from the request query string

        // Check if the query is provided
        if (!query) {
            return res.status(400).json({ message: 'Search query is required' });
        }

        // Create a regular expression to search for contacts that match the query
        const regex = new RegExp(query, 'i');

        // Search for contacts that match the query using Sequelize's Op.or
        const contacts = await Contact.findAll({
            where: {
                [Op.or]: [
                    { fullName: { [Op.like]: `%${query}%` } },
                    { email: { [Op.like]: `%${query}%` } },
                    { phoneNo: { [Op.like]: `%${query}%` } },
                    { role: { [Op.like]: `%${query}%` } },
                    { companyName: { [Op.like]: `%${query}%` } }
                ]
            }
        });

        // Return the search results
        res.status(200).json({ message: 'Contacts searched successfully', contacts });
    } catch (error) {
        console.error(error); // Log the error for debugging
        res.status(500).json({ message: 'Error searching contact', error: error.message });
    }
};

// Sort Contact

const sortContact = async (req, res) => {
    const { sortBy } = req.query;
    let order = [];

    if (sortBy === 'name') {
        order = [['fullName', 'ASC']]; // Sort by firstName in ascending order
    } else if (sortBy === 'date') {
        order = [['createdAt', 'DESC']]; // Sort by createdAt in descending order
     } //else {
    //     return res.status(400).json({ message: 'Invalid sortBy parameter' });
    // }

    try {
        const contacts = await Contact.findAll({
            order: order,
        });
        res.json({ contacts });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching contacts' });
    }
}


// Get Contacts where status is "Interested"
const getInterestedContacts = async (req, res) => {
    try {
        const contacts = await Contact.findAll({
            where: {
                status: 'Interested'
            }
        });

        res.status(200).json({ message: 'Interested contacts fetched successfully', contacts });
    } catch (error) {
        console.error(error); // Log the error for debugging
        res.status(500).json({ message: 'Error fetching interested contacts', error: error.message });
    }
}
// Add Activity
const addActivityToContact = async (req, res) => {
    const { id } = req.params; // Get the contact ID from the request parameters
    const { activityType, description } = req.body; // Get activity details from the request body
    

    try {
        // Find the contact by ID
        const contact = await Contact.findByPk(id);
        

        if (!contact) {
            return res.status(404).json({ message: 'Contact not found' });
        }

        // Create a new activity
        const newActivity = await Activity.create({
            activityType: activityType, 
            description: description,
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
        const { id, activityId } = req.params; // Get the contact and activity IDs from the request parameters

        // Find the contact by ID
        const contact = await Contact.findByPk(id);

        if (!contact) {
            return res.status(404).json({ message: 'Contact not found' });
        }

        // Find the activity by ID
        const activity = await Activity.findByPk(activityId);

        if (!activity) {
            return res.status(404).json({ message: 'Activity not found' });
        }

        // Delete the activity
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
        const { id } = req.params; // Extract the contact ID from the request parameters

        // Find the contact by ID
        const contact = await Contact.findByPk(id);

        // Check if the contact exists
        if (!contact) {
            return res.status(404).json({ message: 'Contact not found' });
        }

        // Get all activities associated with the contact
        const activities = await Activity.findAll({
            where: { contactId: id },
        });

        // Return the activities in the response
        res.status(200).json({ message: 'Activities fetched successfully', activities });
    } catch (error) {
        console.error(error); // Log the error for debugging
        res.status(500).json({ message: 'Error fetching activities', error: error.message });
    }
};




module.exports = {createContact, getAllContacts, deleteContact, editContact, getContact,searchContact, sortContact,getInterestedContacts, addActivityToContact, deleteActivity, getContactActivities}; // Export the functions