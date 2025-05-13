import mongoose, {isValidObjectId} from "mongoose"
import {Video} from "../models/video.model.js"
import User from "../models/User.modal.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"


const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query
    //TODO: get all videos based on query, sort, pagination
})

const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description} = req.body
    // TODO: get video, upload to cloudinary, create video

    if (!req.files || !req.files.video || !req.files.thumbnail) {
        return res.status(400).json({ message: "Video and thumbnail files are required" });
    }

    const videoFileLocalPath = req.files.video[0].path;
    const thumbnailLocalPath = req.files.thumbnail[0].path;

    // Upload files to Cloudinary
    const videoUpload = await uploadOnCloudinary(videoFileLocalPath);
    const thumbnailUpload = await uploadOnCloudinary(thumbnailLocalPath);

    if (!videoUpload || !thumbnailUpload) {
        return res.status(500).json({ message: "File upload failed" });
    }

    // Create video document
    const newVideo = await Video.create({
        videoFile: videoUpload.secure_url,
        thumbnail: thumbnailUpload.secure_url,
        title,
        description,
        duration: Number(duration),
        owner: req.user._id,
    });

    res.status(201).json({
        success: true,
        message: "Video published successfully",
        video: newVideo,
    });
})

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: get video by id
})

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: update video details like title, description, thumbnail

})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: delete video
})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params
})

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}