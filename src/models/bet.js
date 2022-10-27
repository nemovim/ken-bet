import mongoose from 'mongoose';

const betSchema = new mongoose.Schema(
    {
        gameId: { type: String, required: true },
        choice: { type: Number, required: true },
        userId: { type: String, required: true },
        bet: { type: Number, required: true },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model('Bet', betSchema);
