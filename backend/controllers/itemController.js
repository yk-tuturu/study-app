import itemModel from "../models/itemModel.js";
import transactionModel from "../models/transactionModel.js";
import userModel from "../models/userModel.js"; 
import mongoose from "mongoose";

const addItem = async (req, res) => {
    
    //let image_filename = `${req.file.filename}`
    if (!req.body.name || !req.body.type || !req.body.price || !req.body.description) {
      return res.status(400).json({success: false, message: "Name, type, price and description required to create new item"})
    }

    const item = new itemModel({
        name: req.body.name, 
        type: req.body.type, 
        price: req.body.price, 
        description: req.body.description
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
const listItemsByType = async (req, res) => {
  try {
    const { type } = req.body;
    
    if (!type) {
      return res.status(400).json({ message: "item type is required" });
    }

    // query database for items of the specific type
    const items = await itemModel.find({ type }).exec(); 

    if (items.length === 0) {
      return res.status(404).json({ message: "No items found for this type" });
    }

    // Return the filtered items
    return res.status(200).json({
            success: true,
            data: items,
        })
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error while fetching items" });
  }
};

const listAllItems = async (req, res) => {
  try {
    // query database for all items
    const items = await itemModel.find({}).exec(); 

    return res.status(200).json({
            success: true,
            data: items,
        })
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error while fetching items" });
  }
}

const buyItem = async (req, res) => {
  const { itemId } = req.body; 
  const { userID } = req; 

  try {
    // Find user in the database
    const user = await userModel.findById(userID);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find item user wants to buy
    const item = await itemModel.findById(itemId);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    // Check if user has enough coins
    if (user.coins < item.price) {
      return res.status(400).json({ message: "Insufficient coins to buy this item" });
    }

    if (user.owned_items.includes(itemId)) {
      return res.status(400).json({ message: "You already own this item" });
    }

    // Start a session for the transaction
    const session = await mongoose.startSession();
    session.startTransaction();
    
    try {
      // Deduct the price of the item from the user's coins
      user.coins -= item.price;

      // Add the item to the user's owned items list
      user.owned_items.push(itemId);
      await user.save({ session });

      const transaction = new transactionModel({
        userId: userID, 
        itemId: itemId, 
        price: item.price, 
    })

      await transaction.save(); 

      // Commit transaction
      await session.commitTransaction();
      session.endSession();

      res.status(200).json({
        message: "Item purchased successfully",
        data: user.owned_items
      });
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      console.error(error);
      res.status(500).json({ message: "Error processing the transaction" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const wearItem = async (req, res) => {
  const { itemId } = req.body; 
  const { userID } = req; 
  
  try {
    // Find the user in the database
    const user = await userModel.findById(userID);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find the item the user wants to wear
    const item = await itemModel.findById(itemId);
    console.log(item)
    console.log(user)
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    // Check if the user owns the item
    if (!user.owned_items.includes(itemId)) {
      return res.status(400).json({ message: "You do not own this item" });
    }

    // Start a session for the transaction
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // if user is already wearing an item 
      if (user.pet.wearing[item.type] != null) {
        return res.status(400).json({ message: "Pet is wearing another item. Please unequip current item first." });
      }
      
      // If user is already wearing the item 
      if (user.pet.wearing[item.type] == itemId) {
        return res.status(400).json({ message: "Pet is already wearing the item" });
      }

      user.pet.wearing[item.type] = itemId;

      // Save the user with the updated wearing list
      await user.save({ session });

      // Commit the transaction
      await session.commitTransaction();
      session.endSession();

      // Send a success response
      res.status(200).json({
        message: 'item changed successfully',
        wearing: user.pet.wearing 
      });
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      console.error(error);
      res.status(500).json({ message: "Error processing the transaction" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const takeOffItem = async (req, res) => {
  const { itemId } = req.body; 
  const { userID } = req; 
  
  try {
    // Find the user in the database
    const user = await userModel.findById(userID);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find the item the user wants to wear
    const item = await itemModel.findById(itemId);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    // Check if the user owns the item
    if (!user.owned_items.includes(itemId)) {
      return res.status(400).json({ message: "You do not own this item" });
    }

    // Start a session for the transaction
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // if user is already wearing an item 
      if (user.pet.wearing[item.type] === null) {
        return res.status(400).json({ message: "Pet is not wearing an item." });
      }
      
      // If user is wearing another item
      if (user.pet.wearing[item.type] != itemId) {
        return res.status(400).json({ message: "Pet is wearing another item" });
      }

      user.pet.wearing[item.type] = null;

      // Save the user with the updated wearing list
      await user.save({ session });

      // Commit the transaction
      await session.commitTransaction();
      session.endSession();

      // Send a success response
      res.status(200).json({
        message: 'item unequipped successfully',
        wearing: user.pet.wearing 
      });
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      console.error(error);
      res.status(500).json({ message: "Error processing the transaction" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const equipItem = async (req, res) => {
  const { itemId } = req.body; 
  const { userID } = req; 

  try {
    // Find the user in the database
    const user = await userModel.findById(userID);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find the item the user wants to wear
    const item = await itemModel.findById(itemId);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    // Check if the user owns the item
    if (!user.owned_items.includes(itemId)) {
      return res.status(400).json({ message: "You do not own this item" });
    }

    // Start a session for the transaction
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // If an item is already being worn in that part, replace with the new item)
      if (user.pet.wearing[item.type] == itemId) {
        // Remove current item 
        user.pet.wearing[item.type] = null; 
      }

      else {
        // change current item to item in req body
        user.pet.wearing[item.type] = itemId;
      }

      // Save the user with the updated wearing list
      await user.save({ session });

      // Commit the transaction
      await session.commitTransaction();
      session.endSession();

      // Send a success response
      res.status(200).json({
        message: 'item changed successfully',
        wearing: user.pet.wearing 
      });
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      console.error(error);
      res.status(500).json({ message: "Error processing the transaction" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export {addItem, listItemsByType, buyItem, wearItem, listAllItems, takeOffItem, equipItem}; 