import {Router} from "express";
import {validateRegisterUser,validateLogin} from "../validator/auth.validator.js";
import {register,login} from "../controllers/auth.controller.js";
const router = Router();

router.post("/register",validateRegisterUser,register);
router.post("/login",validateLogin,login);

export default router;