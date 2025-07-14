const Project = require("../model/Project");
const User = require("../model/User");

const createProject = async (req, res) => {
  try {
    const { title, tags } = req.body;
    const userId = req.user.id;
    const newProject = await Project.create({
      title,
      tags,
      createdBy: userId,
      members: [userId],
    });
    res.status(201).json({ success: true, project: newProject });
  } catch (err) {
    console.error("Create Project Error:", err);
    res.status(500).json({ success: false, message: "Error creating project" });
  }
};

const getUserProjects=async(req,res)=>{
    try{
        const userId=req.user.id;

        const projects= await Project.find({
            members:userId,

        }).populate("createdBy","name").populate("members","name");

           res.status(200).json({ success: true, projects });

    }
    catch(err){
      res.status(500).json({ success: false, message: "Error fetching projects" });
    }
};

//   for adding member

const addMember = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { userIdtoAdd } = req.body;
    const project = await Project.findById(projectId);
    if (!project)
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    //Only creator can add
    if (project.createdBy.toString() != req.user.id)
      return res.status(403).json({
        success: false,
        message: "Not authorized",
      });
    if (project.members.includes(userIdtoAdd))
      return res.status(400).json({
        success: false,
        message: "User already a member",
      });

    project.members.push(userIdtoAdd);
    await project.save();

    res.status(200).json({
      success: true,
      message: "Member Added",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error Adding member",
    });
  }
};

const removeMember=async (req,res)=>{
    try{
        const {projectId}=req.params;
        const {userIdtoRemove}=req.body;
        

        if (userIdtoRemove === project.createdBy.toString()) {
  return res.status(400).json({
    success: false,
    message: "Cannot remove the group creator",
  });
}

        
        const project=await Project.findById(projectId);
        if(!project)
            return res.status(404).json({
        success:false,
    message:"Project not found"});
        
    if(project.createdBy.toString()!=req.user.id)
        return res.status(403).json(
    {
        success:false,
        message:"Not authorized",
    });
     
    project.members=project.members.filter((id)=>
    id.toString()!== userIdtoRemove);


    await project.save();
    res.status(200).json(
        {
            success:true,
            message:"Member removed"
        }
    );
    }
    catch(err){
      res.status(500).json(
        {
            success:false,
            message:"Error removing member"
        }
      );
    }
};

const getProjectMembers=async(req,res)=>{
    try{
        const {projectId}=req.params;
        const project=await Project.findById(projectId).populate("members","name email");
        
        if(!project)
            return res.status(404).json(
        {
            success:false,
            messsage:"Project not found",
        })
        res.status(200).json(
            {
                success:true,
                members:project.members,
            }
        );

    }
    catch(err){
        res.status(500).json({
            success:false,
            message:"Error Fetching members"
        });

    }
};


//for deleting the project

const deleteProject = async (req, res)=>{
  try{
    const {projectId}=req.params;
    const project= await Project.findById(projectId);
    if(!project){
      return res.status(403).json({
        success:false,
        message:"Project not found"
      })
    }
    //only creator can delete the project
    if(project.createdBy.toString() !==req.user.id){
      return res.status(403).json({ success:false, message:"Not authorized"});
    }

    await Project.findByIdAndDelete(projectId);
    res.status(200).json({
      success:true,
      message:"Project deleted"
    })
  }catch(err){
    console.error("Delete Project Error:",err);
    res.status(500).json({success:false,message:"Error deleting the project"});
  }
};

const joinProject= async (req,res)=>{
  const {projectId}= req.params;
  const userId=req.user._id;
  try{
      

    const project=await Project.findById(projectId);

    if(!project){
    return res.status(404).json({message:"Project not found"})
    }
    
     const alreadyMember = project.members.some(
      (id) => id.toString() === userId.toString()
    );

    if (alreadyMember) {
      return res.status(400).json({ message: "Already a member of the project" });
    }
    project.members.push(userId);
    await project.save();
    res.status(200).json({
      message:'Sucessfully Joined'
    })
  }
  catch(err){
    console.error("Join project error:",err);
    res.status(500).json({
      message:'Server error'
    });
  }
};
// ✅ Get all groups (used for search)
const getAllGroups = async (req, res) => {
  try {
    const groups = await Project.find()
      .select("title tags members createdBy")
      .populate("createdBy", "name")
      .populate("members", "name");

    res.status(200).json({ success: true, groups });
  } catch (err) {
    console.error("Get All Groups Error:", err);
    res.status(500).json({ success: false, message: "Error fetching groups" });
  }
};


const getAdminProjects= async(req,res)=>{
  const projects=await Project.find({createdBy:req.user.id})
  .populate("members","name")
  .populate("createdBy","name");
  res.status(200).json({success:true, projects});
};

module.exports={
    createProject,
    getUserProjects,
    addMember,
    removeMember,
    getProjectMembers,
    deleteProject,
    joinProject,
    getAllGroups,
    getAdminProjects,
};
