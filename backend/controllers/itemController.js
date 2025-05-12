import itemModel from "../models/itemModel.js";

const addItem = async (req, res) => {
    
    let image_filename = `${req.file.filename}`

    const item = new itemModel({
        name: req.body.name, 
        type: req.body,type, 
        price: req.body.price, 
        image: image_filename, 
    })
    
    try {
        await item.save(); 
        res.json({success:true, message: "Item Added"})

    } catch (error) {
        console.log(error);
        res.json({success: false, message: "Error adding item"})
    }
}

// list all items by type 
const listItem = async (req, res) => {

}

const buyItem = async (req, res) => {
}

const wearItem = async (req, res) => {
}

const removeItem = async (req, res) => {
}

export {addItem, }; 