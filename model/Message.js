const mongoose=require('mongoose');

const messageSchema=new mongoose.Schema({
    content:{
        type:String,
        required:true
    },
    sender:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    groupId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Project',
        required:true
    },
    fileUrl: {
      type: String, // Cloudinary public URL
    },
    fileName: {
      type: String, // e.g., "assignment.pdf"
    },
},
{ timestamps: true });

module.exports =mongoose.model('Message', messageSchema);