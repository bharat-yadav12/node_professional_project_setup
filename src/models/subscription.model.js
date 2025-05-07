import mongoose from "mongoose"

const subscriptionSchema = new mongoose.Schema({
    subscriber:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    channel:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }
},{timestamps:true});

export const Subscription = new mongoose.model("Subscription",subscriptionSchema);




// code written by the github copilot

// const mongoose = require('mongoose');

// const subscriptionSchema = new mongoose.Schema(
//     {
//         userId: {
//             type: mongoose.Schema.Types.ObjectId,
//             ref: 'User',
//             required: true,
//         },
//         plan: {
//             type: String,
//             enum: ['free', 'basic', 'premium'],
//             required: true,
//         },
//         startDate: {
//             type: Date,
//             default: Date.now,
//         },
//         endDate: {
//             type: Date,
//             required: true,
//         },
//         status: {
//             type: String,
//             enum: ['active', 'inactive', 'cancelled'],
//             default: 'active',
//         },
//     },
//     {
//         timestamps: true,
//     }
// );

// const Subscription = mongoose.model('Subscription', subscriptionSchema);

// module.exports = Subscription;
