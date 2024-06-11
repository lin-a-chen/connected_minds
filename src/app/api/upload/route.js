import { v2 as cloudinary } from "cloudinary";
import User from "@/models/User";
import fs from "fs";
import path from "path";

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const config = {
	api: {
		bodyParser: false, // Required to handle file uploads
	},
};

export const POST = async (req, res) => {
	if (req.method !== "POST") {
		return new Response(
			JSON.stringify({ success: false, data: "Method not allowed" }),
			{ status: 405 }
		);
	}

	try {
		const formData = await req.formData();
		const file = await formData.get("file");
		const userId = await formData.get("userId");

		if (!file || !userId) {
			return res
				.status(400)
				.json({ success: false, data: "Missing file or userId" });
		}

		if (file.size > 6000000) {
			return res
				.status(400)
				.json({ success: false, data: "File size too large" });
		}

        const uploadDir = path.join(process.cwd(), 'public/uploads/images');
        const tempFilePath = path.join(uploadDir, file.name);

        // Ensure the directory exists
        await fs.promises.mkdir(uploadDir, { recursive: true });

        await fs.promises.writeFile(tempFilePath, Buffer.from(await file.arrayBuffer()));

        // Now use the saved file path for Cloudinary upload
        const uploadResponse = await cloudinary.uploader.upload(tempFilePath, {
            public_id: file.name, // Optional: Set a custom public ID
            overwrite: true, // Optional: Overwrite existing files with the same name
        });

      const imageUrl = uploadResponse.secure_url;

		const updatePhotoResult = await User.changePhoto(userId, imageUrl);
		if (!updatePhotoResult.success) {
			return new Response(
				JSON.stringify({
					success: false,
					data: "Failed to update photo",
				}),
				{ status: 500 }
			);
		}

		return new Response(
			JSON.stringify({
				success: true,
				data: "Photo updated successfully!",
			}),
			{ status: 201 }
		);
	} catch (error) {
		console.error(
			"Error uploading to Cloudinary or updating database:",
			error
		);
		return new Response(
			JSON.stringify({ success: false, data: "Server error" }),
			{ status: 500 }
		);
	}
};
