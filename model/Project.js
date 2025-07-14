const mongoose=require('mongoose');

const projectSchema= new mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
    tags:{
        type:[String],
        default:[],
    },
    members:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
    },
],
    
    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
},
    {
        timestamps:true,
    }
);

  module.exports=mongoose.model("Project", projectSchema);
  