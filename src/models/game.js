import mongoose from 'mongoose';

const gameSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        content: { type: String, default: '' },
        state: { type: String, required: true }, // 'wait' 'open' 'close' 'end'
        choiceList: [
            {
                title: { type: String, required: true },
                pot: { type: Number, default: 0 },
                bettor: { type: Number, default: 0},
            },
        ],
        pot: { type: Number, default: 0 },
        bettor: { type: Number, default: 0 },
        result: { type: Number }
    },
    {
        timestamps: true,
    }
);

export default mongoose.model('Game', gameSchema);
