import express, { Router } from 'express';
import { createUser,getAllUsers,getUserById,updateUser,deleteUser,registerUser,loginUser,logoutUser,tempController ,refreshAccessToken} from '../controllers/user.controller.js';
import { upload } from '../middlewares/multer.middleware.js';
import { addTempvar } from '../middlewares/temp.middleware.js';
import {verifyJWT} from '../middlewares/auth.middleware.js';
const router = express.Router();

//router.route('/register').get(registerUser)
// now the url will be /api/users/register
// here upload .fileds is a router specific middleware . it will be executed only for this route
// and not for the other routes .here we are using multer to upload files
// and we are using the upload middleware to handle the file upload

router.route('/register').post(upload.fields(
  [
    {
      name: "avatar",
      maxCount: 1
    },
    {
      name: "coverImage",
      maxCount: 1
    }
  ]
),registerUser)

router.route('/login').post(loginUser)
router.route('/logout').post(verifyJWT,logoutUser);
router.route('/refresh-token').post(refreshAccessToken);
// an example of using a custome middleware to add a temporary variable to the request object
router.route('/temp').get(addTempvar,tempController)

router.route('/')
  .post(createUser)
  .get(getAllUsers);

router.route('/:id')
  .get(getUserById)
  .put(updateUser)
  .delete(deleteUser);



export default router;