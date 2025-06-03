import mongoose from 'mongoose';

const ruleSchema = new mongoose.Schema({
    field: String,
    operator: String,
    value: mongoose.Schema.Types.Mixed
});

const segmentSchema = new mongoose.Schema({
    name: String,
    operator: { 
        type: String, 
        enum: ['AND', 'OR'], default: 'AND' },
    rules: [ruleSchema]
});

const campaignSchema = new mongoose.Schema({
    name: String,
    segment: segmentSchema,
    messageTemplate: String,
    status: { 
        type: String, 
        enum: ['draft', 'scheduled', 'running', 'completed'], 
        default: 'draft' 
    },
    audienceSize: Number,
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User' 
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    }
});

export const Campaign = mongoose.model('Campaign', campaignSchema);