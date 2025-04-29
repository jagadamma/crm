// const {Contact} = require('../models/contactmodel.js')
// const {Lead} = require('../models/leadsmodel.js')
// const { Op } = require('sequelize');



// // create leads
// const createLead = async (req, res) =>{
//     try {
//         const { contactId, leadName, userName, status, description } = req.body;
    
//         const contact = await Contact.findByPk(contactId);
//         if (!contact) {
//           return res.status(404).send({ message: 'Contact not found' });
//         }
    
//         const newLead = await Lead.create({
//           contactId,
//           leadName,
//           userName,
//           status,
//           description,
//         });
    
//         res.status(200).send({ message: 'Lead created successfully', newLead });
//       } catch (err) {
//         console.error(err);
//         res.status(500).send({ message: 'Error creating lead' });
//       }
// }

// // Get All Leads
// const getAllLeads = async (req, res) => {
//     try {
//         const leads = await Lead.findAll();
    
//         res.status(200).send({ message: 'Leads fetched successfully', leads });
//       } catch (err) {
//         console.error(err);
//         res.status(500).send({ message: 'Error fetching leads' });
//       }

// }

// // Delete Lead
// const deleteLead = async (req, res) => {
//     try {
//         const { id } = req.params;
    
//         const lead = await Lead.findByPk(id);
//         if (!lead) {
//           return res.status(404).send({ message: 'Lead not found' });
//         }
    
//         await lead.destroy();
    
//         res.send({ message: 'Lead deleted successfully' });
//       } catch (err) {
//         console.error(err);
//         res.status(500).send({ message: 'Error deleting lead' });
//       }
// }

// // Get Lead
// const getLead = async (req, res) => {
//     try {
//         const { id } = req.params;
    
//         const lead = await Lead.findByPk(id);
    
//         if (!lead) {
//           return res.status(404).send({ message: 'Lead not found' });
//         }
    
//         res.send({ message: 'Lead fetched successfully', lead });
//       } catch (err) {
//         console.error(err);
//         res.status(500).send({ message: 'Error fetching lead' });
//       }
// }

// // Edit Lead
// const editLead = async (req, res) => {
//     try {
//         const { id } = req.params;
    
//         const lead = await Lead.findByPk(id);
//         if (!lead) {
//           return res.status(404).send({ message: 'Lead not found' });
//         }
    
//         const { leadName, userName, status, description } = req.body;
    
//         lead.leadName = leadName;
//         lead.userName = userName;
//         lead.status = status;
//         lead.description = description;
    
//         await lead.save();
    
//         res.send({ message: 'Lead updated successfully', lead });
//       } catch (err) {
//         console.error(err);
//         res.status(500).send({ message: 'Error updating lead' });
//       }
// }

// // Search Controller
// const searchLead = async (req, res) => {
//     try {
//         const { query } = req.query;
    
//         const leads = await Lead.findAll({
//           where: {
//             [Op.or]: [
//               { leadName: { [Op.like]: `%${query}%` } },
//               { userName: { [Op.like]: `%${query}%` } },
//               { status: { [Op.like]: `%${query}%` } },
//               { description: { [Op.like]: `%${query}%` } },
//             ],
//           },
//         });
    
//         res.send({ message: 'Leads searched successfully', leads });
//       } catch (err) {
//         console.error(err);
//         res.status(500).send({ message: 'Error searching leads' });
//       }
// }

// // Sort Lead
// const sortLead = async (req, res) => {
//     try {
//         const { sortBy } = req.query;
//         let order = [];


//         if (sortBy === 'name') {
//             order = [['LeadName', 'ASC']]; // Sort by firstName in ascending order
//         } else if (sortBy === 'date') {
//             order = [['createdAt', 'DESC']]; // Sort by createdAt in descending order
//          } 
    
//         const leads = await Lead.findAll({
//           order: order,
//         });
    
//         res.send({ message: 'Leads sorted successfully', leads });
//       } catch (err) {
//         console.error(err);
//         res.status(500).send({ message: 'Error sorting leads' });
//       }
// }




// module.exports = { createLead, getAllLeads, deleteLead, getLead, editLead, searchLead, sortLead };