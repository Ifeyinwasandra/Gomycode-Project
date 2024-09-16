const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authController = require('./controllers/authController');
// const cors = require('cors')
const app = express();


dotenv.config();

// mongodb connect
mongoose.set('strictQuery', false);
mongoose.connect(process.env.MONGO_URL)
.then(() => ('DB Connection Successfully'))
.catch((err) => {
    console.log("failed to connect to DB")
});

//routes & middlewares
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use("/auth", authController) 

// starting server
app.listen(process.env.PORT || 5000, () => {
    console.log('Server has been started successfully')
});