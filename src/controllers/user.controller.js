import User from "../models/User.modal.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import fs from "fs";
import path from "path";

// actual code according to hitesh video tutorial

export const registerUser = asyncHandler(async (req, res) => {
  // get user details from frontend
     // validation - not empty
     // check if user already exists: username, email
     // check for images, check for avatar
     // upload them to cloudinary, avatar
     // create user object - create entry in db
     // remove password and refresh token field from response
     // check for user creation
     // return res
    const { username, email, fullName,password } = req.body;
     //console.log("req.body", req.body)
    // console.log("req.body", username,email,fullName,password)

    // if([username,email,fullName,password].some((field)=> field?.trim() === "")){
    //     throw new ApiError(400,"All fields are required")
    // }
    // better validation :-
    const requiredFields = { fullName, email, username, password };

    for (const [key, value] of Object.entries(requiredFields)) {
        if (!value || value.trim() === "") {
            throw new ApiError(400, `Field "${key}" is required`);
        }
    }

    const existingUser = await User.findOne({
        $or: [
            { username },
            { email }
        ]
    })
    // console.log("existingUser", existingUser)

   
   //console.log("req.files", req.files)
    const avatarLocalPath = req.files?.avatar[0]?.path;
    //const coverImageLocalPath = req.files?.coverImage[0]?.path;
    let coverImageLocalPath;
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path
    }

    if(!avatarLocalPath){
        throw new ApiError(400, "Avatar is required")
    }

    if (existingUser) {
      const normalizedPath = path.resolve(avatarLocalPath);
     fs.unlinkSync(normalizedPath);
      throw new ApiError(409, "User with email or username already exists")
  }

    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);

    //console.log("avatar cloudinary response ",avatar);

    if(!avatar){
        throw new ApiError(400, "Avatar is required")
    }

    const user = await User.create({
        username:username.toLowerCase(),
        email,
        fullName,
        password,
        avatar: avatar.url,
        coverImage: coverImage?.url || ""
    })
    const createdUser = await User.findById(user._id).select("-password -refreshToken");

    if(!createdUser){
        throw new ApiError(500, "Something went wrong while registering the user")
    }
    res.status(201).json(new ApiResponse(201, createdUser,"User created successfully"));
});



// const asyncHandler = (requestHandler) => {
//     console.log("async handler is called with requestHandler", requestHandler)
//     return (req, res, next) => {
//         console.log("async handler is returnrned called with req,res,next", req.url)
//         Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err))
//     }
// }

//(req, res, next) => {
    //         console.log("async handler is returnrned called with req,res,next", req.url)
    //         Promise.resolve(async (req, res) => {
//     const { name, email, age } = req.body;
//     const user = await User.create({ name, email, age });
//     res.status(201).json(user);
//   }).catch((err) => next(err))
    //     }

// Create User
export const createUser = asyncHandler(async (req, res) => {
    const { name, email, age,password } = req.body;
    const user = await User.create({ name, email, age,password });
    const { password: _, ...userWithoutPassword } = user.toObject();
    res.status(201).json(userWithoutPassword);
  });
  
  // Read All Users
  export const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find({});
    res.status(200).json(users);
  });
  
  // Read Single User
  export const getUserById = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  });
  
  // Update User
  export const updateUser = asyncHandler(async (req, res) => {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  });
  
  // Delete User
  export const deleteUser = asyncHandler(async (req, res) => {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json({ message: "User deleted successfully" });
  });


  