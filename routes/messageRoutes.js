const express=require('express');
const router=express.Router();
const {sendMessage,getGroupMessages,sendFileMessage}=require('../controllers/messageController');
const protect=require('../middleware/auth');
const upload =require("../middleware/upload");


router.post('/:groupId/send',protect, sendMessage);
router.post("/:groupId/send-file",protect,upload.single("file"),sendFileMessage);
router.get('/:groupId',protect,getGroupMessages);

module.exports=router;