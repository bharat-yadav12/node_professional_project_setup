import User from "../models/User.modal.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { Subscription } from "../models/subscription.model.js";
import fs from "fs";
import path from "path";
import jwt from "jsonwebtoken"

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
     console.log('registe route')
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
   console.log(req.files)
   console.log(req.files?.avatar[0]?.path)
    const avatarLocalPath = req.files?.avatar[0]?.path;
    console.log(req.files?.avatar[0]?.path)
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
  res.status(200).cookie("accessToken",accessToken,options).cookie("refreshToken",refreshToken,options).json(new ApiResponse(200,{user:loggedInUser,accessToken,refreshToken},"User logged in successfully"))
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

// refresh access token 

export const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
      throw new ApiError(401, "unauthorized request")
  }

  try {
      const decodedToken = jwt.verify(
          incomingRefreshToken,
          process.env.REFRESH_TOKEN_SECRET
      )
  
      const user = await User.findById(decodedToken?._id)
  
      if (!user) {
          throw new ApiError(401, "Invalid refresh token")
      }
  
      if (incomingRefreshToken !== user?.refreshToken) {
          throw new ApiError(401, "Refresh token is expired or used")
          
      }
  
      const options = {
          httpOnly: true,
          secure: true
      }
  
      const {accessToken, refreshToken} = await generateAccessAndRefereshTokens(user._id)
  
      return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(
          new ApiResponse(
              200, 
              {accessToken,refreshToken},
              "Access token refreshed"
          )
      )
  } catch (error) {
      throw new ApiError(401, error?.message || "Invalid refresh token")
  }

})

export const changeCurrentPassword = asyncHandler(async(req, res) => {
  console.log("req.user",req.user);
  const {oldPassword, newPassword} = req.body
  if(!oldPassword || !newPassword){
      throw new ApiError(400, "Old password and new password are required")
  }
  if(oldPassword === newPassword){
      throw new ApiError(400, "Old password and new password cannot be same")
  }


  const user = await User.findById(req.user?._id)
  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)

  if (!isPasswordCorrect) {
      throw new ApiError(400, "Invalid old password")
  }

  user.password = newPassword
  await user.save({validateBeforeSave: false})

  return res
  .status(200)
  .json(new ApiResponse(200, {}, "Password changed successfully"))
})

// code written by me:-
// export const changeCurrentPassword = asyncHandler(async (req, res, next) => {
//   // check if user is authenticated or not
//   // using access token
//   // take password from the User
//   // hash them usign bcrypt
//   // save in the database
//   // send response
//   const accessToken =
//     req?.cookies?.accessToken ||
//     req.header("Authorization")?.replace("Bearer ", "");

//     const {password} = req.body;
//     if(!accessToken){
//       throw new ApiError(401,"unauthorised to do this request");
//     }
//   const decodedToken = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);

//   if(!decodedToken){
//     throw new ApiError(400,"user's access token is not valid");
//   }

//   const user = await User.findById(decodedToken._id);
//   if(!user){
//     throw new ApiError(404,"user not found");
//   }
//   if(!password){
//     throw new ApiError(400,"please enter valid password:");
//   }

//   user.password = password;
//   await user.save({validateBeforeSave:false});

//   res.status(200).json(new ApiResponse(200,user,"password updated successfully:"));
// });

export const getCurrentUser = asyncHandler(async(req,res)=>{
  const user = req.user;
  console.log("user is ",user);
  
  if(!user){
    throw new ApiError(404,"user not found!")
  }
  res.status(200).json(new ApiResponse(200,user));
})

export const updateAccountDetails = asyncHandler(async(req, res) => {
  const {fullName, email} = req.body

  if (!fullName || !email) {
      throw new ApiError(400, "All fields are required")
  }

  const user = await User.findByIdAndUpdate(
      req.user?._id,
      {
          $set: { fullName,email}
      },
      {new: true}
      
  ).select("-password -refreshToken")
  if (!user) {
      throw new ApiError(404, "User not found")
  }

  return res
  .status(200)
  .json(new ApiResponse(200, user, "Account details updated successfully"))
});

export const updateUserAvatar = asyncHandler(async(req, res) => {
  const avatarLocalPath = req.file?.path

  if (!avatarLocalPath) {
      throw new ApiError(400, "Avatar file is missing")
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath)

  if (!avatar.url) {
      throw new ApiError(400, "Error while uploading on avatar")
  }

  const user = await User.findByIdAndUpdate(
      req.user?._id,
      {
          $set:{
              avatar: avatar.url
          }
      },
      {new: true}
  ).select("-password -refreshToken")
  if (!user) {
      throw new ApiError(404, "User not found")
  }

  return res
  .status(200)
  .json(
      new ApiResponse(200, user, "Avatar image updated successfully")
  )
})

export const updateUserCoverImage = asyncHandler(async(req, res) => {
  const coverImageLocalPath = req.file?.path

  if (!coverImageLocalPath) {
      throw new ApiError(400, "Cover image file is missing")
  }

  const coverImage = await uploadOnCloudinary(coverImageLocalPath)

  if (!coverImage.url) {
      throw new ApiError(400, "Error while uploading on avatar")
      
  }

  const user = await User.findByIdAndUpdate(
      req.user?._id,
      {
          $set:{
              coverImage: coverImage.url
          }
      },
      {new: true}
  ).select("-password -refreshToken")

  return res
  .status(200)
  .json(
      new ApiResponse(200, user, "Cover image updated successfully")
  )
})

export const getUserChannelProfile = asyncHandler(async(req, res) => {
  const {username} = req.params

  if (!username?.trim()) {
      throw new ApiError(400, "username is missing")
  }

  const channel = await User.aggregate([
      {
          $match: {
              username: username?.toLowerCase()
          }
      },
      {
          $lookup: {
              from: "subscriptions",
              localField: "_id",
              foreignField: "channel",
              as: "subscribers"
          }
      },
      {
          $lookup: {
              from: "subscriptions",
              localField: "_id",
              foreignField: "subscriber",
              as: "subscribedTo"
          }
      },
      {
          $addFields: {
              subscribersCount: {
                  $size: "$subscribers"
              },
              channelsSubscribedToCount: {
                  $size: "$subscribedTo"
              },
              isSubscribed: {
                  $cond: {
                      if: {$in: [req.user?._id, "$subscribers.subscriber"]},
                      then: true,
                      else: false
                  }
              }
          }
      },
      {
          $project: {
              fullName: 1,
              username: 1,
              subscribersCount: 1,
              channelsSubscribedToCount: 1,
              isSubscribed: 1,
              avatar: 1,
              coverImage: 1,
              email: 1

          }
      }
  ])

  if (!channel?.length) {
      throw new ApiError(404, "channel does not exists")
  }

  return res
  .status(200)
  .json(
      new ApiResponse(200, channel[0], "User channel fetched successfully")
  )
})

export const getWatchHistory = asyncHandler(async(req, res) => {
    const user = await User.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(req.user._id)
            }
        },
        {
            $lookup: {
                from: "videos",
                localField: "watchHistory",
                foreignField: "_id",
                as: "watchHistory",
                pipeline: [
                    {
                        $lookup: {
                            from: "users",
                            localField: "owner",
                            foreignField: "_id",
                            as: "owner",
                            pipeline: [
                                {
                                    $project: {
                                        fullName: 1,
                                        username: 1,
                                        avatar: 1
                                    }
                                }
                            ]
                        }
                    },
                    {
                        $addFields:{
                            owner:{
                                $first: "$owner"
                            }
                        }
                    }
                ]
            }
        }
    ])

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            user[0].watchHistory,
            "Watch history fetched successfully"
        )
    )
})

// without pipline :-
const getUserChannelProfileWithoutPipline = asyncHandler(async (req, res) => {
  const { username } = req.params;
  if (!username.trim()) {
    throw new ApiError(400, 'username is not provided');
  }

  const user = await User.findOne({ username }).select("-password -refreshToken");
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const allSubscribers = await Subscription.find({ channel: user._id });
  const subscribersCount = await Subscription.countDocuments({ channel: user._id });
  const subscribeToCount = await Subscription.countDocuments({ subscriber: user._id });

  const isSubscribed = allSubscribers.some(
    (sub) => sub.subscriber.toString() === req.user_id
  );

  res.status(200).json(
    new ApiResponse(200, {
      user,
      subscribersCount,
      subscribeToCount,
      isSubscribed
    })
  );
});




// export const refreshAccessToken = asyncHandler(async (req, res, next) => {
//   console.log("refreshAccessToken is called");
  
//   const token =
//     req?.cookies?.refreshToken ||
//     req?.header("Authorization")?.replace("Bearer ", "");
//     console.log("token is ", token)
//   const decodedToken = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
//  console.log("decodedToken is ", decodedToken)
//   if (!decodedToken) {
//     throw new ApiError(404, "unauthorised accessd denied");
//   }

//   const user = await User.findById(decodedToken._id).select("-password -refreshToken")
//   const accessToken = user.generateAccessToken();
//   const option = {
//     httpOnly:true,
//     secure:true
//   }

//   res.cookie("accessToken",accessToken,option).cookie("refreshToken",token).json(new ApiResponse(200,{data:user,accessToken}))
// });

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
    const users = await User.find({}).select("-password -refreshToken");
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


  