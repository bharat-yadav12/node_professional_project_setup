import User from "../models/User.modal.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import bcrypt from "bcrypt"

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
    // console.log("req.body", req.body)
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

    if (existingUser) {
      throw new ApiError(409, "User with email or username already exists")
  }
  // console.log("req.files", req.files)
    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverImageLocalPath = req.files?.coverImage[0]?.path;

    if(!avatarLocalPath){
        throw new ApiError(400, "Avatar is required")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);

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
    res.status(201).json(new ApiResponse(201, "User created successfully", createdUser));
});

const resetPassword = async () => {
  const newPassword = 'password'; // Set your new test password
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await User.findOneAndUpdate(
    { email: 'bharat.yadav12345@gmail.com' },
    { password: hashedPassword }
  );

  console.log('Password reset successful');
};

const generateAccessAndRefereshTokens = async(userId) =>{
  try {
      const user = await User.findById(userId)
      const accessToken = user.generateAccessToken()
      const refreshToken = user.generateRefreshToken()

      user.refreshToken = refreshToken
      await user.save({ validateBeforeSave: false })

      return {accessToken, refreshToken}


  } catch (error) {
      throw new ApiError(500, "Something went wrong while generating referesh and access token")
  }
}



export const loginUser = asyncHandler(async(req, res)=>{
  // get data from user (username,email) and password
  // find user from db basedon username or email
  // if userFound then mathc it's password
  const {username,email,password} = req.body;

  if(!username && !email){
    throw new ApiError(400,"username or email is required")
  }

  const user = await User.findOne({
    $or:[{username},{email}]
  })
  console.log('founded user is ',user);
  //await resetPassword(); // Call the password reset function

  if(!user){
    throw new ApiError(404,"user not found!");
  }
  const isPasswordCorrect = await user.isPasswordCorrect(password);
  if(!isPasswordCorrect){
    throw new ApiError(401,"password is incorrect!");
  }
  const {accessToken, refreshToken} = await generateAccessAndRefereshTokens(user._id)
  console.log('accessToken is ',accessToken);
  console.log('refreshToken is ',refreshToken);
  const loggedInUser = await User.findById(user._id).select("-password -refreshToken")
  const options = {
    httpOnly: true,
    secure: true
  }
  console.log('loggedInUser is ',loggedInUser);
  res.status(200).cookie("accessToken",accessToken,options).cookie("refreshToken",refreshToken,options).json(new ApiResponse(200,loggedInUser,"User logged in successfully"))
});
export const logoutUser = asyncHandler(async(req, res) => {
  const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      {
          $set: {
              refreshToken: ""// previously not worked when using undefined
          }
      },
      {
          new: true
      }
  )
  console.log(" updatedUser is ", updatedUser)

  const options = {
      httpOnly: true,
      secure: true
  }

  return res
  .status(200)
  .clearCookie("accessToken", options)
  .clearCookie("refreshToken", options)
  .json(new ApiResponse(200, {}, "User logged Out"))
})

// generate logoutuser controller

// export const logoutUser = asyncHandler(async(req, res)=>{
//   // get refresh token from cookie
//   // find user from db based on refresh token
//   // if user found then remove refresh token from db and send success response
//   // if user not found then send error response

//   const {refreshToken} = req.cookies;
//   if(!refreshToken){
//     throw new ApiError(400,"Refresh token is required")
//   }
//   const user = await User.findOne({refreshToken});
//   if(!user){
//     throw new ApiError(404,"User not found")
//   }
//   await User.findByIdAndUpdate(user._id,{refreshToken:""})
//   res.clearCookie("accessToken").clearCookie("refreshToken").status(200).json(new ApiResponse(200,"User logged out successfully"))
// }
// );




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

  export const tempController = asyncHandler(async (req, res) => {
    console.log("chekcing the valueof the req.temp set by addtemp middleware",req.temp)
    res.status(200).json({ message: "temp controller is working" });
  });


  