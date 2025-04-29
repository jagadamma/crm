const {Contact, Activity} = require('../models/contactmodel.js'); // Import the Contact model
const cloudinary = require('cloudinary').v2

const uploadImage = async (req,res) =>{
    try {
        if(!req.file){
            return res.status(400).json({message: "No file"})
        }
        console.log(req.file);
        
        // Upload the file to Cloudinary
        const result = await cloudinary.uploader.upload(req.file.path);
    
        // Return the uploaded file URL
        res.status(201).json({ url: result.secure_url });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error uploading file" });
      }
}

module.exports = {uploadImage}; // Export the function