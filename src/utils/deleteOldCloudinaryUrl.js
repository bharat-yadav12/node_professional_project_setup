const cloudinary = require('cloudinary').v2;
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary with your credentials
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Deletes an old file from Cloudinary.
 * @param {string} publicId - The public ID of the file to delete.
 * @returns {Promise<void>}
 */
async function deleteOldCloudinaryUrl(publicId) {
    try {
        if (!publicId) {
            throw new Error('Public ID is required to delete a file from Cloudinary.');
        }

        const result = await cloudinary.uploader.destroy(publicId);
        if (result.result === 'ok') {
            console.log(`Successfully deleted file with public ID: ${publicId}`);
        } else {
            console.error(`Failed to delete file with public ID: ${publicId}. Reason: ${result.result}`);
        }
    } catch (error) {
        console.error('Error deleting file from Cloudinary:', error.message);
        throw error;
    }
}

module.exports = deleteOldCloudinaryUrl;