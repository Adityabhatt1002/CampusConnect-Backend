const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth'); // Import the middleware
const { signup, loginUser,forgotPassword,resetPassword } = require('../controllers/authController');
const { createProject,
    getUserProjects,
    addMember,
    removeMember,
    getProjectMembers,
    deleteProject,
    joinProject,
    getAllGroups,
    getAdminProjects}=require("../controllers/projectController");
// Register user (No middleware required)
router.post('/signup', signup);

//Reset and forgot password
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

// Login user (No middleware required)
router.post('/login', loginUser);

router.get('/me', authMiddleware,(req,res)=>{
  res.status(200).json(req.user);
});

router.post("/logout", (req,res)=>{ 
  res.clearCookie("jwt",{
    httpOnly:false,
    secure:false,
    sameSite:"Lax"
  });
  res.status(200).json({message:"Logged Out"});
});




// Protected route (requires middleware)
router.get('/profile', authMiddleware, (req, res) => {
  res.json({ msg: 'This is a protected route' });
});

router.post("/create", authMiddleware, createProject);



// Get details of one project by ID
router.get("/user", authMiddleware, getUserProjects);
router.post("/:projectId/join",authMiddleware,joinProject);
router.get("/all",authMiddleware,getAllGroups);
router.get("/admin-projects", authMiddleware,getAdminProjects);
router.post("/:projectId/add", authMiddleware, addMember);
// Kick a member from project
router.post("/:projectId/kick", authMiddleware, removeMember);
// Add a new member to project
router.get("/:projectId/member", authMiddleware,getProjectMembers);
//delete a project 
router.delete("/:projectId/delete", authMiddleware, deleteProject);
module.exports = router;

//join a group using invite
