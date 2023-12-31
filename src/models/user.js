import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    num: { type: Number, required: true, unique: true },
    id: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true, unique: true },
    coin: { type: Number, default: 1000, required: true },
    level: {type: Number, default: 0},
});

export default mongoose.model('User', userSchema);