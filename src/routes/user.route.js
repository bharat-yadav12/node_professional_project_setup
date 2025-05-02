import express from 'express';
import { createUser,getAllUsers,getUserById,updateUser,deleteUser,registerUser } from '../controllers/user.controller.js';
import { upload } from '../middlewares/multer.middleware.js';
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

router.route('/')
  .post(createUser)
  .get(getAllUsers);

router.route('/:id')
  .get(getUserById)
  .put(updateUser)
  .delete(deleteUser);



export default router;