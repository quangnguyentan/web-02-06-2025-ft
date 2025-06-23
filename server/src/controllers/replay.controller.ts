import { Request, RequestHandler, Response } from "express";
import Replay, { IReplay } from "../models/replay.model";
import Match from "../models/match.model";
import { upload } from "../middlewares/multer";
import fs from "fs/promises";
import path from "path";
// const baseURL = "http://localhost:8080";
const baseURL = "https://sv.hoiquan.live";
// REMEMBER: Your global type definition in src/types/express.d.ts is crucial for this to work.
// Ensure it contains:
/*
declare namespace Express {
  interface Request {
    files?: {
      videoUrl?: Multer.File[];
      thumbnail?: Multer.File[];
      // ... ensure all other fields from match.controller are also here if applicable
      // Example:
      // streamLinkImages?: Multer.File[];
      // streamLinkVideos?: Multer.File[];
      // streamLinkCommentatorImages?: Multer.File[];
      // mainCommentatorImage?: Multer.File[];
      // secondaryCommentatorImage?: Multer.File[];
    };
  }
}
*/

// Middleware to handle file uploads
export const uploadFiles = upload.fields([
  { name: "videoUrl", maxCount: 1 },
  { name: "thumbnail", maxCount: 1 },
]);

// @desc    Create a new replay video
// @route   POST /api/replays
export const createReplay: RequestHandler[] = [
  uploadFiles,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const body = req.body;
      // *** FIX: Type assertion for files ***
      const files = req.files as
        | {
          videoUrl?: Express.Multer.File[];
          thumbnail?: Express.Multer.File[];
        }
        | undefined;

      // Validate match
      const matchExists = await Match.findById(body.match);
      if (!matchExists) {
        res.status(400).json({ message: "ID trận đấu không hợp lệ" });
        return;
      }

      // Validate video file
      // Now 'files' is correctly typed, so 'files?.videoUrl' is valid
      if (!files?.videoUrl?.[0]) {
        res.status(400).json({ message: "File video là bắt buộc" });
        return;
      }

      // Handle video file
      // Accessing files.videoUrl[0] is now safe because of the check above
      const videoUrl = `${baseURL}/static/${path.basename(
        files.videoUrl[0].path
      )}`;

      // Handle thumbnail file (optional)
      const thumbnailUrl = files?.thumbnail?.[0]
        ? `${baseURL}/static/${path.basename(files.thumbnail[0].path)}`
        : undefined;

      // Prepare replay data
      const replayData: Partial<IReplay> = {
        title: body.title,
        slug: body.slug,
        description: body.description,
        videoUrl,
        thumbnail: thumbnailUrl,
        match: body.match,
        sport: body.sport,
        duration: body.duration ? Number(body.duration) : undefined,
        views: body.views ? Number(body.views) : 0,
        commentator: body.commentator,
        publishDate: body.publishDate || new Date().toISOString(),
        isShown: body.isShown === "true" ? true : false,
      };

      const newReplay = new Replay(replayData);
      await newReplay.save();
      const populatedReplay = await Replay.findById(newReplay._id)
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
        });

      res.status(201).json(populatedReplay);
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ message: "Lỗi server", error: error.message });
    }
  },
];

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
export const updateReplay: RequestHandler[] = [
  uploadFiles,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const body = req.body;
      // *** FIX: Type assertion for files ***
      const files = req.files as
        | {
          videoUrl?: Express.Multer.File[];
          thumbnail?: Express.Multer.File[];
        }
        | undefined;

      // Validate match if provided
      if (body.match) {
        const matchExists = await Match.findById(body.match);
        if (!matchExists) {
          res.status(400).json({ message: "ID trận đấu không hợp lệ" });
          return;
        }
      }

      // Find existing replay
      const existingReplay = await Replay.findById(req.params.id);
      if (!existingReplay) {
        res.status(404).json({ message: "Không tìm thấy video" });
        return;
      }

      // Collect old file paths for deletion
      const oldFiles: string[] = [];

      // Initialize update data
      const updateData: Partial<IReplay> = {
        title: body.title || existingReplay.title,
        slug: body.slug || existingReplay.slug,
        description:
          body.description !== undefined
            ? body.description
            : existingReplay.description,
        match: body.match || existingReplay.match,
        sport: body.sport || existingReplay.sport,
        duration: body.duration
          ? Number(body.duration)
          : existingReplay.duration,
        views: body.views ? Number(body.views) : existingReplay.views,
        commentator:
          body.commentator !== undefined
            ? body.commentator
            : existingReplay.commentator,
        publishDate: body.publishDate || existingReplay.publishDate,
        isShown:
          body.isShown === "true"
            ? true
            : body.isShown === "false"
              ? false
              : existingReplay.isShown,
      };

      // Handle video upload
      // Now 'files' is correctly typed, so 'files?.videoUrl' is valid
      if (files?.videoUrl?.[0]) {
        updateData.videoUrl = `${baseURL}/static/${path.basename(
          files.videoUrl[0].path
        )}`;
        if (existingReplay.videoUrl?.startsWith(`${baseURL}/static/`)) {
          const filename = path.basename(existingReplay.videoUrl);
          oldFiles.push(path.join(__dirname, "../../assets/images", filename));
        }
      } else if (body.videoUrl) {
        updateData.videoUrl = body.videoUrl;
      } else {
        updateData.videoUrl = existingReplay.videoUrl;
      }

      // Handle thumbnail upload
      // Now 'files' is correctly typed, so 'files?.thumbnail' is valid
      if (files?.thumbnail?.[0]) {
        updateData.thumbnail = `${baseURL}/static/${path.basename(
          files.thumbnail[0].path
        )}`;
        if (existingReplay.thumbnail?.startsWith(`${baseURL}/static/`)) {
          const filename = path.basename(existingReplay.thumbnail);
          oldFiles.push(path.join(__dirname, "../../assets/images", filename));
        }
      } else if (body.thumbnail === "") {
        updateData.thumbnail = undefined;
        if (existingReplay.thumbnail?.startsWith(`${baseURL}/static/`)) {
          const filename = path.basename(existingReplay.thumbnail);
          oldFiles.push(path.join(__dirname, "../../assets/images", filename));
        }
      } else if (body.thumbnail) {
        updateData.thumbnail = body.thumbnail;
      } else {
        updateData.thumbnail = existingReplay.thumbnail;
      }

      // Validate videoUrl
      if (!updateData.videoUrl) {
        res.status(400).json({ message: "URL video là bắt buộc" });
        return;
      }

      // Update replay
      const updatedReplay = await Replay.findByIdAndUpdate(
        req.params.id,
        updateData,
        {
          new: true,
          runValidators: true,
        }
      )
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
        });

      if (!updatedReplay) {
        res.status(404).json({ message: "Không tìm thấy video" });
        return;
      }

      // Delete old files
      for (const filePath of oldFiles) {
        try {
          await fs.access(filePath); // Check if file exists before trying to unlink
          await fs.unlink(filePath);
        } catch (err) {
          console.error(`Lỗi khi xóa file cũ: ${filePath}`, err);
        }
      }

      res.status(200).json(updatedReplay);
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ message: "Lỗi server", error: error.message });
    }
  },
];

// @desc    Xóa một video xem lại
// @route   DELETE /api/replays/:id
export const deleteReplay = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const deletedReplay = await Replay.findById(req.params.id);
    if (!deletedReplay) {
      res.status(404).json({ message: "Không tìm thấy video" });
      return;
    }

    // Delete video file if it exists
    if (deletedReplay.videoUrl?.startsWith(`${baseURL}/static/`)) {
      const videoPath = path.join(
        __dirname,
        "../../assets/images",
        path.basename(deletedReplay.videoUrl)
      );
      try {
        await fs.access(videoPath); // Check if file exists before trying to unlink
        await fs.unlink(videoPath);
      } catch (err) {
        console.error(`Lỗi khi xóa file video: ${videoPath}`, err);
      }
    }

    // Delete thumbnail file if it exists
    if (deletedReplay.thumbnail?.startsWith(`${baseURL}/static/`)) {
      const thumbnailPath = path.join(
        __dirname,
        "../../assets/images",
        path.basename(deletedReplay.thumbnail)
      );
      try {
        await fs.access(thumbnailPath); // Check if file exists before trying to unlink
        await fs.unlink(thumbnailPath);
      } catch (err) {
        console.error(`Lỗi khi xóa file thumbnail: ${thumbnailPath}`, err);
      }
    }

    await Replay.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Đã xóa video thành công" });
  } catch (error: any) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};
