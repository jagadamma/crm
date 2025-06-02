// const express = require('express')
// const authrouter = require('./routes/authRoute.js')
// const userRouter = require('./routes/userRoute.js')
// const contactrouter = require('./routes/contactRoute.js')
// // const leadrouter = require('./routes/leadRoute.js')
// const taskrouter = require('./routes/taskRoute.js')
// const cors = require('cors')
// require('dotenv').config();
// const app = express();
// const bodyParser = require('body-parser');
// const sequelize = require('./db/db.js')
// const cloudinary = require('cloudinary').v2
// cloudinary.config({
//     cloud_name: process.env.CLOUD_NAME,
//     api_key: process.env.CLOUD_API_KEY,
//     api_secret: process.env.CLOUD_API_SECRET
// })


// //middlewares
// app.use(cors());
// app.use(bodyParser.json());



// // Sync database
// sequelize.sync()
//     .then(() => console.log('Database synced'))
//     .catch(err => console.error('Error syncing database:', err));

//     app.use('/api/auth', authrouter);
//     app.use('/api/users', userRouter);
//     app.use('/api/contacts', contactrouter);
//     // app.use('/api/leads', leadrouter);
//     app.use('/api/tasks', taskrouter);

// const PORT =  5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

const express = require('express');
const authrouter = require('./routes/authRoute.js');
const userRouter = require('./routes/userRoute.js');
const contactrouter = require('./routes/contactRoute.js');
// const leadrouter = require('./routes/leadRoute.js');
const taskrouter = require('./routes/taskRoute.js');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const bodyParser = require('body-parser');
const sequelize = require('./db/db.js');
const cloudinary = require('cloudinary').v2;

const app = express();

// ⬇ Increase the limit to 10mb (you can adjust as needed)
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

// Cloudinary configuration
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
});

// Middlewares
app.use(cors({
    origin: '*', // For all domains. For production, specify allowed origin
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(bodyParser.json());

// Serve static frontend files from /public (React build)
app.use(express.static(path.join(__dirname, 'public')));

// Serve uploaded files (Multer) from /uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Sync database
sequelize.sync()
    .then(() => console.log('Database synced'))
    .catch(err => console.error('Error syncing database:', err));

// API routes
app.use('/api/auth', authrouter);
app.use('/api/users', userRouter);
app.use('/api/contacts', contactrouter);
// app.use('/api/leads', leadrouter);
app.use('/api/tasks', taskrouter);

// React frontend fallback (must be after other routes)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Dynamic port for GCP or local
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
