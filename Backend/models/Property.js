const mongoose = require("mongoose")

const PropertySchema = new mongoose.Schema({
    currentOwner: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true,
    },
    title: {
        type: String,
        required: true,
        min: 8,
    },
    type: {
        type: String,
        enum: ["semi-detached duplex", "detached duplex", "detached terrace"],
        required: true,
    },
    desc: {
        type: String,
        required: true,
        min: 20,
    },
    img: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    sqmeters: {
        type: String,
        required: true,
    },
    states: {
        type: String,
        required: true, 
    },
    bedrooms: {
        type: String,
        required: true,
        min: 2,
    },
    featured: {
        type: Boolean,
        default: false,
    }
}, {timestamps: true});

module.exports = mongoose.model("Property", PropertySchema);