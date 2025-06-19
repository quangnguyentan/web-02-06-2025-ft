import { Request, Response } from "express";
import Replay, { IReplay } from "../models/replay.model";
import Match from "../models/match.model";
import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import cloudinary from "../configs/cloudinary";

// Configure multer for file storage in memory
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB limit
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|mp4|mov|avi/;
    const mimetype = filetypes.test(file.mimetype);
    if (mimetype) {
      return cb(null, true);
    }
    cb(new Error("File type not supported"));
  },
});

// Middleware to handle file uploads
export const uploadFiles = upload.fields([
  { name: "videoUrl", maxCount: 1 },
  { name: "thumbnail", maxCount: 1 },
]);

// @desc    Create a new replay video
// @route   POST /api/replays
export const createReplay = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { match } = req.body;
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    // Validate match
    const matchExists = await Match.findById(match);
    if (!matchExists) {
      res.status(400).json({ message: "Invalid match ID" });
      return;
    }

    // Upload video to Cloudinary
    let videoUrl = "";
    if (files.videoUrl && files.videoUrl[0]) {
      const videoUpload = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            resource_type: "video",
            folder: "replays/videos",
            public_id: `video_${uuidv4()}`,
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        uploadStream.end(files.videoUrl[0].buffer);
      });
      videoUrl = (videoUpload as any).secure_url; // Fixed here
    }

    // Upload thumbnail to Cloudinary (optional)
    let thumbnailUrl = "";
    if (files.thumbnail && files.thumbnail[0]) {
      const thumbnailUpload = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            resource_type: "image",
            folder: "replays/thumbnails",
            public_id: `thumbnail_${uuidv4()}`,
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        uploadStream.end(files.thumbnail[0].buffer);
      });
      thumbnailUrl = (thumbnailUpload as any).secure_url;
    }

    // Create new replay
    const newReplay: IReplay = new Replay({
      ...req.body,
      videoUrl,
      thumbnail: thumbnailUrl || undefined,
    });

    await newReplay.save();
    res.status(201).json(newReplay);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
};

// @desc    Lấy tất cả video xem lại
// @route   GET /api/replays
export const getAllReplays = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { excludeId } = req.query;
    const filter: any = {};
    if (excludeId) {
      filter._id = { $ne: excludeId };
    }
    const replays = await Replay.find(filter)
      // Populate lồng nhau để lấy thông tin chi tiết của trận đấu
      .populate({
        path: "match",
        populate: [
          { path: "homeTeam", select: "name logo" },
          { path: "awayTeam", select: "name logo" },
          { path: "league", select: "name" },
        ],
      })
      .populate({
        path: "sport",
        select: "name icon slug",
      })
      .sort({ createdAt: -1 }); // Sắp xếp video mới nhất lên đầu

    res.status(200).json(replays);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error });
  }
};

// @desc    Lấy một video xem lại theo ID
// @route   GET /api/replays/:id
export const getReplayById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const replay = await Replay.findById(req.params.id)
      .populate("match")
      .populate("sport");
    if (!replay) {
      res.status(404).json({ message: "Không tìm thấy video" });
      return;
    }
    res.status(200).json(replay);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error });
  }
};
export const getReplayBySlug = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    console.log(req.params?.slug);
    const replay = await Replay.findOne({ slug: req.params.slug })
      .populate("match")
      .populate("sport");
    if (!replay) {
      res.status(404).json({ message: "Không tìm thấy video" });
      return;
    }
    res.status(200).json(replay);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error });
  }
};
// @desc    Update a replay video
// @route   PUT /api/replays/:id
export const updateReplay = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { match } = req.body;
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    // Validate match if provided
    if (match) {
      const matchExists = await Match.findById(match);
      if (!matchExists) {
        res.status(400).json({ message: "Invalid match ID" });
        return;
      }
    }

    // Find existing replay
    const existingReplay = await Replay.findById(req.params.id);
    if (!existingReplay) {
      res.status(404).json({ message: "Replay not found" });
      return;
    }

    // Initialize update data
    let updateData: Partial<IReplay> = { ...req.body };

    // Handle video upload
    if (files?.videoUrl?.[0]) {
      // Upload new video to Cloudinary
      const videoUpload = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            resource_type: "video",
            folder: "replays/videos",
            public_id: `video_${uuidv4()}`,
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        uploadStream.end(files.videoUrl[0].buffer);
      });
      updateData.videoUrl = (videoUpload as any).secure_url;

      // Delete old video from Cloudinary if it exists
      if (existingReplay.videoUrl) {
        const publicId = extractPublicId(existingReplay.videoUrl, "video");
        if (publicId) {
          await cloudinary.uploader.destroy(publicId, {
            resource_type: "video",
          });
        }
      }
    } else if (req.body.videoUrl && typeof req.body.videoUrl === "string") {
      // Keep existing video URL if no new file is uploaded
      updateData.videoUrl = req.body.videoUrl;
    }

    // Handle thumbnail upload
    if (files?.thumbnail?.[0]) {
      // Upload new thumbnail to Cloudinary
      const thumbnailUpload = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            resource_type: "image",
            folder: "replays/thumbnails",
            public_id: `thumbnail_${uuidv4()}`,
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        uploadStream.end(files.thumbnail[0].buffer);
      });
      updateData.thumbnail = (thumbnailUpload as any).secure_url;

      // Delete old thumbnail from Cloudinary if it exists
      if (existingReplay.thumbnail) {
        const publicId = extractPublicId(existingReplay.thumbnail, "image");
        if (publicId) {
          await cloudinary.uploader.destroy(publicId, {
            resource_type: "image",
          });
        }
      }
    } else if (req.body.thumbnail && typeof req.body.thumbnail === "string") {
      // Keep existing thumbnail URL if no new file is uploaded
      updateData.thumbnail = req.body.thumbnail;
    } else if (req.body.thumbnail === "") {
      // Remove thumbnail if explicitly cleared
      updateData.thumbnail = undefined;
      if (existingReplay.thumbnail) {
        const publicId = extractPublicId(existingReplay.thumbnail, "image");
        if (publicId) {
          await cloudinary.uploader.destroy(publicId, {
            resource_type: "image",
          });
        }
      }
    }

    // Update replay
    const updatedReplay = await Replay.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedReplay) {
      res.status(404).json({ message: "Replay not found" });
      return;
    }

    res.status(200).json(updatedReplay);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
};

// Helper function to extract public ID from Cloudinary URL
const extractPublicId = (
  url: string,
  resourceType: "video" | "image"
): string | null => {
  try {
    const parts = url.split("/");
    const uploadIndex = parts.indexOf("upload");
    if (uploadIndex === -1) return null;
    const publicIdParts = parts.slice(uploadIndex + 2); // Skip "upload/v<version>"
    const publicId = publicIdParts.join("/").split(".")[0]; // Remove file extension
    return publicId;
  } catch {
    return null;
  }
};

// @desc    Xóa một video xem lại
// @route   DELETE /api/replays/:id
export const deleteReplay = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const deletedReplay = await Replay.findByIdAndDelete(req.params.id);
    if (!deletedReplay) {
      res.status(404).json({ message: "Không tìm thấy video" });
      return;
    }
    res.status(200).json({ message: "Đã xóa video thành công" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error });
  }
};
