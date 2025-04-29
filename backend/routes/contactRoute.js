const express = require('express')
const contactrouter = express.Router()
const { createContact, getAllContacts, deleteContact, editContact, getContact, searchContact, sortContact,getInterestedContacts, addActivityToContact, deleteActivity, getContactActivities } = require('../controllers/contactController.js')
const {uploadImage} = require('../controllers/uploadController.js')
const {upload} = require('../middelwares/multer.js')

contactrouter.post('/create', createContact)
contactrouter.get('/getall', getAllContacts)
contactrouter.delete('/delete/:id', deleteContact)
contactrouter.get('/get/:id', getContact)
contactrouter.put('/edit/:id', editContact)
contactrouter.get('/search', searchContact)
contactrouter.get('/sort', sortContact)
contactrouter.get('/leads', getInterestedContacts)  // Lead controller
contactrouter.post('/:id/activity', addActivityToContact)
contactrouter.delete('/:id/activity/del/:activityId', deleteActivity)
contactrouter.get('/:id/activity', getContactActivities)

contactrouter.post('/upload', upload.single("file"),uploadImage);

module.exports = contactrouter

