const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authController = require('./controllers/authController');
const propertyController = require('./controllers/propertyController');
const uploadController = require('./controllers/uploadController');
const multer = require('multer');
// const cors = require('cors')
const app = express();


dotenv.config();

// mongodb connect
mongoose.set('strictQuery', false);
mongoose.connect(process.env.MONGO_URL)
.then(() => console.log(('DB Connection Successfully')))
.catch((err) => {
    console.log("failed to connect to DB")
});

//routes & middlewares
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use("/auth", authController) 
app.use("/property", propertyController)
app.use("/upload", uploadController)

// starting server
app.listen(process.env.PORT || 5000, () => {
    console.log('Server has been started successfully')
});