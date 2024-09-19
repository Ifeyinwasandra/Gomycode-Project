const Property = require('../models/Property')
const propertyController = require('express').Router()
const verifyToken = require("../middleware/verifyToken")

// get all
propertyController.get('/getAll', async(req, res) => {
    try {
        const properties = await Property.find({})

        return res.status(200).json(properties)
    } catch (error) {
        return res.status(500).json(error.message)
    }
})
// get featured
propertyController.get('/find/featured', async(req, res) => {
    try {
        const featuredProperties = await Property.find({featured: true}).populate('currentOwner', '-password')

        return res.status(200).json(featuredProperties)
    } catch (error) {
        return res.status(500).json(error.message)
    }
})
// get all from a specific type
propertyController.get('/find', async (req, res) => {
    const type = req.query
    // {type: 'semi-detached'}
    try {
      if(type){
        const properties = await Property.find(type).populate('currentOwner', '-password')
        return res.status(200).json(properties)
      } else {
        return res.status(500).json({msg: "No such type"})
      }
    } catch (error) {
        return res.status(500).json(error.message)
    }
})

// get counts of types -> ex: {semi-detached duplex: 4, detached duplex: 8, detached terrace: 2}
propertyController.get('/find/types', async(req, res) => {
    try {
        const semidetachedduplexTypes = await Property.countDocuments({type: 'semi-detached duplex'})
        const detachedduplexTypes = await Property.countDocuments({type: 'detached duplex'})
        const detachedterraceTypes = await Property.countDocuments({type: 'detached terrace'})

        return res.status(200).json({
            semidetachedduplex: semidetachedduplexTypes,
            detachedduplex: detachedduplexTypes,
            detachedterrace: detachedterraceTypes,
        })
    } catch (error) {
        return res.status(500).json(error.message)
    }
})
// get individual property
propertyController.get("/find/:id", async(req, res) => {
    try {
        const property = await Property.findById (req.params.id).populate("currentOwner", '-password')

        if(!property){
            throw new Error("No such property with this id")
        } else {
            return res.status(200).json(property)
        }
    } catch (error) {
        return res.status(500).json(error.message)
    }
})
// create an property
propertyController.post('/', verifyToken, async(req, res) => {
    try {
        const newProperty = await Property.create({...req.body, currentOwner: req.user.id})

        return res.status(201).json(newProperty)
    } catch (error) {
        return res.status(500).json(error.message)
    }
})
// update property
propertyController.put("/:id", verifyToken, async(req, res) => {
    try {
        const property = await Property.findById(req.params.id)
        console.log(property.currentOwner, req.user.id)
        if(property.currentOwner.createFromHexString() !== req.user.id.toString()){
            throw new Error("You are not allowed to update other people properties")
        } else {
            const updateProperty = await Property.findByIdAndUpdate(
               req.params.id,
               {$set: req.body},
               {new: true}
            )

            return res.status(200).json(updateProperty)
        }
    } catch (error) {
        return res.status(500).json(error.message)
    }
})
// delete property
propertyController.delete("/:id", verifyToken, async(req, res) => {
    try {
        const property = await Property.findById(req.params.id)

        if(property.currentOwner.toString() !== req.user.id.toString()){
            throw new Error("You are not allowed to delete other people properties")
        } else {
            await property.delete()

            return res.status(200).json({msg: 'Successfully deleted property'})
        }    
    } catch (error) {
        return res.status(500).json(error.message)
}
})

module.exports = propertyController