import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    itemId: { type: mongoose.Schema.Types.ObjectId, ref: 'item', required: true },
    price: { type: Number, required: true, min: 0 },
    transactionDate: { type: Date, default: Date.now }
});

const transactionModel = mongoose.models.transaction || mongoose.model("transaction", transactionSchema);
export default transactionModel;