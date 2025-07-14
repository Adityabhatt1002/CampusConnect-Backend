const express=require('express');
const router=express.Router();
const {deleteMessageById}=require("../controllers/DeleteController")
const authMiddleware=require('../middleware/auth')

router.delete("/:messageId",authMiddleware,deleteMessageById);

module.exports= router;