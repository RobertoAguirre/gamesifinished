import mongoose from 'mongoose';

const gameEntrySchema = new mongoose.Schema(
  {
    clerkUserId: { type: String, required: true, index: true },
    username: { type: String, required: true },
    gameName: { type: String, required: true },
    gameRawgId: Number,
    gameCoverUrl: String,
    finishedDate: { type: Date, required: true },
    hoursSpent: Number,
    levelReached: String,
    evidenceUrl: { type: String, required: true },
    evidenceType: { type: String, enum: ['image', 'video'], default: 'image' },
  },
  { timestamps: true }
);

export default mongoose.model('GameEntry', gameEntrySchema);
