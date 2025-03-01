import {v2 as cloudinary} from "cloudinary"
import fs from "fs"

cloudinary.config({ 
    cloud_name: process.env.CLOUD_NAME, 
    api_key: process.env.API_KEY, 
    api_secret: process.env.API_SECRET
});

const uploadOnCloudinary= async (localFilePath)=>{
    try {
        if(!localFilePath) return null
        const cloudinary_Response=await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"

        })

        fs.unlinkSync(localFilePath)
        return cloudinary_Response
        
    } catch (error) {
        fs.unlinkSync(localFilePath)
        return null
    }
}
const deleteFromCloudinary=async(publicId)=>{
    try {
        if(!publicId) return null
        const result=await cloudinary.uploader.destroy(publicId)
        return result
        
    } catch (error) {
        console.log(error,"eror while deletinf from cloudinary")
        return null
    }
}

export {uploadOnCloudinary, deleteFromCloudinary}