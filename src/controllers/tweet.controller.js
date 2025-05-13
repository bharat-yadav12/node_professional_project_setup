import mongoose, { isValidObjectId } from "mongoose"
import {Tweet} from "../models/tweet.model.js"
import User from "../models/User.modal.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const createTweet = asyncHandler(async (req, res) => {
    //TODO: create tweet
    const user = req.user;
    const {content} = req.body;

    if(!user && !user?._id){
        throw new ApiError(404,"user not found!");
    }

    if(!content?.trim()){
        throw new ApiError(400,"please provide the content");
    }


    const tweet = await Tweet.create({content,owner:req.user._id})

    res.status(201).json(new ApiResponse(201,tweet))
})

const getUserTweets = asyncHandler(async (req, res) => {
    // TODO: get user tweets
    const user = req.user;
    const {userId} = req.params;

    if(!user && !user?._id){
        throw new ApiError(404,"user not found!");
    }

    if(!userId){
        throw new ApiError(400,"please provide the user id ");
    }

    if (!isValidObjectId(userId)) {
        throw new ApiError(400, "Invalid user ID format.");
    }
    
    const userTweets = await Tweet.find({ owner: userId }).populate("owner", "fullName email username ");
    res.status(200).json(new ApiResponse(200, { tweets: userTweets }));

    // const tweet = await Tweet.find({owner:userId})

    // res.status(200).json(new ApiResponse(200,tweet))
})

const updateTweet = asyncHandler(async (req, res) => {
    //TODO: update tweet

    const user = req.user;
    const {tweetId} = req.params;
    const {content} = req.body;

    if(!user && !user?._id){
        throw new ApiError(404,"user not found!");
    }

    if(!tweetId){
        throw new ApiError(400,"please provide the user id ");
    }

    if(!content && !content.trim()){
        throw new ApiError(400,"please provide the content");
    }

    if(!isValidObjectId(tweetId)){
        throw new ApiError(400,"tweetId  is not valid");
    }

    const tweet = await Tweet.findById(tweetId)
    if(!tweet){
        throw new ApiError(404,"no tweet exist with this id")
    }

    if(tweet.owner.toString() !== user._id.toString()){
        throw new ApiError(400,"user is not authenticate to do the request")
    }
    tweet.content = content;
    await tweet.save();




    //const userUpdatedTweet = await Tweet.findByIdAndUpdate(tweetId,{content}, {new:true})
    res.status(200).json(new ApiResponse(200,tweet))
})

const deleteTweet = asyncHandler(async (req, res) => {
    console.log('deleted tweet is called')
    //TODO: delete tweet
    const {tweetId} = req.params;

    if(!tweetId){
        throw new ApiError(400,"please provide tweet id");
    }

    if(!isValidObjectId(tweetId)){
        throw new ApiError(400,"tweetId  is not valid");
    }

    const tweet = await Tweet.findById(tweetId)
    if(!tweet){
        throw new ApiError(404,"no tweet exist with this id")
    }

    if(tweet.owner.toString() !== req.user._id.toString()){
        throw new ApiError(400,"user is not authenticate to do the request")
    }

     await tweet.deleteOne();


    res.status(200).json(new ApiResponse(400,{},"the tweet deleted succssfully:"))
})
// write a controller to get all tweets of a user



export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}