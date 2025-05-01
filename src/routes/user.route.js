import express from 'express';
import { createUser,getAllUsers,getUserById,updateUser,deleteUser,registerUser } from '../controllers/user.controller.js';

const router = express.Router();

router.route('/register').get(registerUser)
// now the url will be /api/users/register

router.route('/')
  .post(createUser)
  .get(getAllUsers);

router.route('/:id')
  .get(getUserById)
  .put(updateUser)
  .delete(deleteUser);



export default router;