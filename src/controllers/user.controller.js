import User from "../models/User.modal.js";
import { asyncHandler } from "../utils/asyncHandler.js";

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
    const { name, email, age } = req.body;
    const user = await User.create({ name, email, age });
    res.status(201).json(user);
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