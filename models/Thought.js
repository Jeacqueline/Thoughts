const { timeStamp } = require('console');
const mongoose = require('mongoose');
const User = require('./User');

//Date format
const formatDate = (timestamp)=>{
    return new Date(timestamp).toLocaleDateString('en-US',{
        year:'numeric',
        month:'short',
        day:'numeric',
        timeZone:'UTC',
    });
};

const reactionSchema = new mongoose.Schema(
    {
        reactionId: {
            type: mongoose.Types.ObjectId,
            default: () => new mongoose.Types.ObjectId()
        },
        reactionBody: {
            type: String,
            required: true,
            max_length: 280,
            min:1,
        },
        username: {
            type: String,
            required: true,
        },
        createdAt: {
            type: Date,
            default: Date.now(),
            get: (date)=>formatDate(date)
        }
    },
    
    {id: false}
);

const thoughtSchema = new mongoose.Schema(
    {
        thoughtText: {
            type: String,
            required: true,
            max_length: 280,
            min_length: 1,
        },
        createdAt: {
            type: Date,
            default: Date.now(),
            get: (date)=>formatDate(date)

        },
        username: {
            User,
            type: String,
            required: true,
        },
        reactions: [reactionSchema],
    },
    {
        toJSON: {
            virtuals: true,
        },
        id: false,
    }
);

thoughtSchema.virtual('reactionCount').get(function () {
    return this.reactions.length;
});

const Thought = mongoose.model('Thought', thoughtSchema);

module.exports = Thought;