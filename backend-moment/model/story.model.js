import mongoose from 'mongoose';

const storySchema = new mongoose.Schema({
    image: {type: String, required: true},
    author: {type: mongoose.Schema.Types.ObjectId, ref:"User", required: true},
    viewers: [{type: mongoose.Schema.Types.ObjectId, ref:"User"}],
    expiresAt: {type: Date, default: () => new Date(Date.now() + 24 * 60 * 60 * 1000)}, // 24 hours from now
}, {timestamps: true});

// Index for automatic expiration
storySchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const Story = mongoose.model("Story", storySchema);