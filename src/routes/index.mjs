import { Router } from "express";
import localArrayUsersRouter from "./localArrayUsers.mjs";
import usersRouter from "./users.mjs";
import productsRouter from "./products.mjs";
import arraypassauth from "./passportAuth.mjs";
import arrayauth from './localArrayAuth.mjs';

const router = Router();
router.use(usersRouter);
router.use(productsRouter);
router.use(arraypassauth);
router.use(arrayauth);

export default router;