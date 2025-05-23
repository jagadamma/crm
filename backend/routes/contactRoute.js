const express = require('express')
const contactrouter = express.Router()
const { createContact, deleteContact,deleteMultipleContacts, editContact, getContact, searchContact, sortContact,getInterestedContacts, addActivityToContact, deleteActivity, getContactActivities, checkUnique, getMyContacts } = require('../controllers/contactController.js')
const {uploadImage} = require('../controllers/uploadController.js')
const {upload} = require('../middelwares/multer.js')
const authenticationMiddleware = require('../middelwares/authmiddleware');


contactrouter.post('/create', authenticationMiddleware, createContact)
contactrouter.get('/getall', authenticationMiddleware, getMyContacts);
// contactrouter.get('/getall', getAllContacts)
contactrouter.delete('/delete/:id', deleteContact)
contactrouter.post('/delete-multiple', deleteMultipleContacts);
contactrouter.get('/get/:id', getContact)
contactrouter.put('/edit/:id', editContact)
contactrouter.get('/search', searchContact)
contactrouter.get('/sort', sortContact)
contactrouter.get('/leads', getInterestedContacts)  // Lead controller
contactrouter.post('/:id/activity', addActivityToContact)
contactrouter.delete('/:id/activity/del/:activityId', deleteActivity)
contactrouter.get('/:id/activity', getContactActivities)

contactrouter.post('/upload', upload.single("file"),uploadImage);

contactrouter.get('/check-unique', checkUnique);

module.exports = contactrouter

