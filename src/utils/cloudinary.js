import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import path from "path";


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null;
        //upload the file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto",
        });
        // file has been uploaded successfull
        // console.log("file is uploaded on cloudinary ", response.url);
        //fs.unlinkSync(localFilePath)
        // onw window backword slash path gives issue so use path module
        //path: 'public\\temp\\bharat.jpg',
        const normalizedPath = path.resolve(localFilePath);
        console.log("normalizedPath is ",normalizedPath)
        fs.unlinkSync(normalizedPath);
        return response;

    } catch (error) {
        //fs.unlinkSync(localFilePath) // remove the locally saved temporary file as the upload operation got failed
        const normalizedPath = path.resolve(localFilePath);
        fs.unlinkSync(normalizedPath);
        return null;
    }
};

export {uploadOnCloudinary}


// cloudinary original code
//import { v2 as cloudinary } from 'cloudinary';
// (async function() {

//     // Configuration
//     cloudinary.config({ 
//         cloud_name: 'dde6qdo6n', 
//         api_key: '847721986976549', 
//         api_secret: '<your_api_secret>' // Click 'View API Keys' above to copy your API secret
//     });
    
//     // Upload an image
//      const uploadResult = await cloudinary.uploader
//        .upload(
//            'https://res.cloudinary.com/demo/image/upload/getting-started/shoes.jpg', {
//                public_id: 'shoes',
//            }
//        )
//        .catch((error) => {
//            console.log(error);
//        });
    
//     console.log(uploadResult);
    
//     // Optimize delivery by resizing and applying auto-format and auto-quality
//     const optimizeUrl = cloudinary.url('shoes', {
//         fetch_format: 'auto',
//         quality: 'auto'
//     });
    
//     console.log(optimizeUrl);
    
//     // Transform the image: auto-crop to square aspect_ratio
//     const autoCropUrl = cloudinary.url('shoes', {
//         crop: 'auto',
//         gravity: 'auto',
//         width: 500,
//         height: 500,
//     });
    
//     console.log(autoCropUrl);    
// })();