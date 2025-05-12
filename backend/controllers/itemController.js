import itemModel from "../models/itemModel.js";
import userModel from "./models/userModel"; 

const addItem = async (req, res) => {
    
    let image_filename = `${req.file.filename}`

    const item = new itemModel({
        name: req.body.name, 
        type: req.body,type, 
        price: req.body.price, 
        description: req.body.description, 
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
const listItemsByType = async (req, res) => {
  try {
    const { type } = req.body.type;  
    
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
            itemList: items,
        })
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error while fetching items" });
  }
};

const buyItem = async (req, res) => {
  const { userId, itemId } = req.body; 

  try {
    // Find user in the database
    const user = await userModel.findById(userId);
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

    // Start a session for the transaction
    const session = await mongoose.startSession();
    session.startTransaction();
    
    try {
      // Deduct the price of the item from the user's coins
      user.coins -= item.price;

      // Save the user with the updated coin balance
      await user.save({ session });

      // Add the item to the user's owned items list
      user.owned_items.push(itemId);
      await user.save({ session });

      // Commit transaction
      await session.commitTransaction();
      session.endSession();

      res.status(200).json({
        message: "Item purchased successfully",
        owned_items: user.owned_items
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
  const { userId, itemId } = req.body; 
  
  try {
    // Find the user in the database
    const user = await userModel.findById(userId);
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
        user.pet.wearing[part] = null;
      }

      else {
        // change current item to item in req body
        user.pet.wearing[part] = itemId;
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

export {addItem, listItemsByType, buyItem, wearItem}; 