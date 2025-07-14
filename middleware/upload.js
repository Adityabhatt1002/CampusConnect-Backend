const multer= require('multer');
const {CloudinaryStorage}= require("multer-storage-cloudinary");
const cloudinary=require("../util/cloudinary");

const storage=new CloudinaryStorage({
    cloudinary,
    params: async (req,file)=>{
        const allowedImageTypes =["image/jpeg","image/png","image/jpg"];
        const allowedDocTypes=[
            "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
      "application/vnd.openxmlformats-officedocument.presentationml.presentation", // .pptx
        ];
        const isImage=allowedImageTypes.includes(file.mimetype);
        const isDoc=allowedDocTypes.includes(file.mimetype);

        if(!isImage && !isDoc){
            throw new Error("file type not supported");

        }
        return {
            folder:"chat_uploads",
            resource_type: isDoc ? "raw" : "image",
            public_id:`${Date.now()}-${file.originalname}`,
        };
    },
});

const limits={
    fileSize:10 * 1024 * 1024,
};

const upload = multer({
  storage,
  limits,
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/jpg",
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    ];
    if (allowedTypes.includes(file.mimetype)) cb(null, true);
    else cb(new Error("Unsupported file format"), false);
  },
});

module.exports = upload;
