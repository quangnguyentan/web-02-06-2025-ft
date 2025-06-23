import { Request, RequestHandler, Response } from "express";
import Match, { IMatch, MatchStatus } from "../models/match.model";
import User from "../models/user.model";

import { upload } from "../middlewares/multer";
import fs from "fs/promises";
import path from "path";
const baseURL = "http://localhost:8080";
// const baseURL = "https://sv.hoiquan.live";
// Remove or comment out this custom interface.
// interface MulterRequest extends Request {
//   files?: {
//     streamLinkImages?: Express.Multer.File[];
//     streamLinkVideos?: Express.Multer.File[];
//     streamLinkCommentatorImages?: Express.Multer.File[];
//     mainCommentatorImage?: Express.Multer.File[];
//     secondaryCommentatorImage?: Express.Multer.File[];
//   };
// }

// @desc    Tạo một trận đấu mới
// @route   POST /api/matches
export const createMatch: RequestHandler[] = [
  upload.fields([
    { name: "streamLinkImages", maxCount: 10 },
    { name: "streamLinkCommentatorImages", maxCount: 10 },
  ]),
  async (req: Request, res: Response): Promise<void> => {
    try {
      const body = req.body;

      // Access req.files and assert its type
      const files = req.files as
        | {
            streamLinkImages?: Express.Multer.File[];
            streamLinkCommentatorImages?: Express.Multer.File[];
          }
        | undefined;

      // Parse streamLinks
      let streamLinks: any[] = [];
      if (body.streamLinks && typeof body.streamLinks === "string") {
        try {
          streamLinks = JSON.parse(body.streamLinks);
        } catch (error) {
          res
            .status(400)
            .json({ message: "Danh sách streamLinks không hợp lệ" });
          return;
        }
      }

      // Process uploaded files
      const streamLinkImages = files?.streamLinkImages || [];
      const streamLinkCommentatorImages =
        files?.streamLinkCommentatorImages || [];

      // Map streamLinks with uploaded files and update User.image
      const processedStreamLinks = await Promise.all(
        streamLinks.map(async (link: any, index: number) => {
          let commentatorImageUrl: string | undefined;
          if (streamLinkCommentatorImages[index]) {
            commentatorImageUrl = `${baseURL}/static/${path.basename(
              streamLinkCommentatorImages[index].path
            )}`;

            // Update User.image if commentator exists
            if (link.commentator) {
              const user = await User.findByIdAndUpdate(
                link.commentator,
                { avatar: commentatorImageUrl },
                { new: true, runValidators: true }
              );
              if (!user) {
                console.warn(
                  `User not found for commentator ID: ${link.commentator}`
                );
              }
            }
          }

          return {
            label: link.label,
            url: link.url,
            image: streamLinkImages[index]
              ? `${baseURL}/static/${path.basename(
                  streamLinkImages[index].path
                )}`
              : link.image || undefined,
            commentator: link.commentator || undefined,
            commentatorImage:
              commentatorImageUrl || link.commentatorImage || undefined,
            priority: link.priority ? Number(link.priority) : 1,
          };
        })
      );
      // Determine status based on streamLinks
      const hasValidStreamLinks = processedStreamLinks.some(
        (link) =>
          link.url && typeof link.url === "string" && link.url.trim() !== ""
      );
      // Prepare match data
      const matchData: Partial<IMatch> = {
        title: body.title,
        slug: body.slug,
        homeTeam: body.homeTeam,
        awayTeam: body.awayTeam,
        league: body.league,
        sport: body.sport,
        startTime: body.startTime ? new Date(body.startTime) : undefined,
        status: hasValidStreamLinks ? MatchStatus.LIVE : MatchStatus.UPCOMING,
        scores: body.scores
          ? typeof body.scores === "string"
            ? JSON.parse(body.scores)
            : body.scores
          : { homeScore: 0, awayScore: 0 },
        streamLinks: processedStreamLinks,
        isHot: body.isHot === "true",
      };

      const newMatch = new Match(matchData);
      await newMatch.save();

      // Populate after saving
      const populatedMatch = await Match.findById(newMatch._id)
        .populate("homeTeam", "name logo")
        .populate("awayTeam", "name logo")
        .populate("league", "name logo")
        .populate("sport", "name icon slug")
        .populate("streamLinks.commentator", "username avatar");
      res.status(201).json(populatedMatch);
    } catch (error: any) {
      console.error("Create match error:", error);
      res.status(500).json({ message: "Lỗi server", error: error.message });
    }
  },
];

// @desc    Lấy tất cả trận đấu (có filter)
// @route   GET /api/matches
export const getAllMatches = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { status, sport, league, excludeId } = req.query;
    const filter: any = {};
    if (status) filter.status = status;
    if (sport) filter.sport = sport;
    if (league) filter.league = league;
    if (excludeId) {
      filter._id = { $ne: excludeId };
    }
    const matches = await Match.find(filter)
      .populate("homeTeam", "name logo")
      .populate("awayTeam", "name logo")
      .populate("league", "name logo")
      .populate("sport", "name icon slug")
      .populate("streamLinks.commentator", "username avatar")
      .sort({ startTime: -1 }); // Sắp xếp trận mới nhất lên đầu

    res.status(200).json(matches);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error });
  }
};

// @desc    Lấy một trận đấu theo ID
// @route   GET /api/matches/:id
export const getMatchById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const match = await Match.findById(req.params.id)
      .populate("homeTeam", "name logo")
      .populate("awayTeam", "name logo")
      .populate("league", "name logo")
      .populate("sport", "name icon slug")
      .populate("streamLinks.commentator", "username avatar");
    if (!match) {
      res.status(404).json({ message: "Không tìm thấy trận đấu" });
      return;
    }
    res.status(200).json(match);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error });
  }
};

export const getMatchBySlug = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const match = await Match.findOne({ slug: req.params.slug })
      .populate("homeTeam", "name logo")
      .populate("awayTeam", "name logo")
      .populate("league", "name logo")
      .populate("sport", "name icon slug")
      .populate("streamLinks.commentator", "username avatar");

    if (!match) {
      res.status(404).json({ message: "Không tìm thấy trận đấu" });
      return;
    }
    res.status(200).json(match);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error });
  }
};

// @desc    Cập nhật một trận đấu
// @route   PUT /api/matches/:id
export const updateMatch: RequestHandler[] = [
  upload.fields([
    { name: "streamLinkImages", maxCount: 10 },
    { name: "streamLinkCommentatorImages", maxCount: 10 },
  ]),
  async (req: Request, res: Response): Promise<void> => {
    try {
      const match = await Match.findById(req.params.id);
      if (!match) {
        res.status(404).json({ message: "Không tìm thấy trận đấu" });
        return;
      }

      const body = req.body;
      const files = req.files as
        | {
            streamLinkImages?: Express.Multer.File[];
            streamLinkCommentatorImages?: Express.Multer.File[];
          }
        | undefined;

      // Parse streamLinks
      let streamLinks: any[] = [];
      if (body.streamLinks && typeof body.streamLinks === "string") {
        try {
          streamLinks = JSON.parse(body.streamLinks);
        } catch (error) {
          res
            .status(400)
            .json({ message: "Danh sách streamLinks không hợp lệ" });
          return;
        }
      }

      // Process uploaded files
      const streamLinkImages = files?.streamLinkImages || [];
      const streamLinkCommentatorImages =
        files?.streamLinkCommentatorImages || [];

      // Collect old file paths for deletion
      const oldFiles: string[] = [];
      for (const link of match.streamLinks) {
        if (link.image?.startsWith(`${baseURL}/static/`)) {
          oldFiles.push(
            path.join(
              __dirname,
              "../../assets/images",
              path.basename(link.image)
            )
          );
        }
        if (link.commentatorImage?.startsWith(`${baseURL}/static/`)) {
          oldFiles.push(
            path.join(
              __dirname,
              "../../assets/images",
              path.basename(link.commentatorImage)
            )
          );
        }
      }

      // Map streamLinks with uploaded files and update User.image
      const processedStreamLinks = await Promise.all(
        streamLinks.map(async (link: any, index: number) => {
          let commentatorImageUrl: string | undefined;
          if (streamLinkCommentatorImages[index]) {
            commentatorImageUrl = `${baseURL}/static/${path.basename(
              streamLinkCommentatorImages[index].path
            )}`;

            // Update User.image if commentator exists
            if (link.commentator) {
              const user = await User.findByIdAndUpdate(
                link.commentator,
                { avatar: commentatorImageUrl },
                { new: true, runValidators: true }
              );
              if (!user) {
                console.warn(
                  `User not found for commentator ID: ${link.commentator}`
                );
              }
            }
          }

          return {
            label: link.label,
            url: link.url,
            image: streamLinkImages[index]
              ? `${baseURL}/static/${path.basename(
                  streamLinkImages[index].path
                )}`
              : link.image || undefined,
            commentator: link.commentator || undefined,
            commentatorImage:
              commentatorImageUrl || link.commentatorImage || undefined,
            priority: link.priority ? Number(link.priority) : 1,
          };
        })
      );
      const hasValidStreamLinks = processedStreamLinks.some(
        (link) =>
          link.url && typeof link.url === "string" && link.url.trim() !== ""
      );

      // Prepare update data
      const updateData: Partial<IMatch> = {
        title: body.title || match.title,
        slug: body.slug || match.slug,
        homeTeam: body.homeTeam || match.homeTeam,
        awayTeam: body.awayTeam || match.awayTeam,
        league: body.league || match.league,
        sport: body.sport || match.sport,
        startTime: body.startTime ? new Date(body.startTime) : match.startTime,
        status: hasValidStreamLinks ? MatchStatus.LIVE : MatchStatus.UPCOMING,
        scores: body.scores
          ? typeof body.scores === "string"
            ? JSON.parse(body.scores)
            : body.scores
          : match.scores,
        streamLinks: processedStreamLinks,
        isHot:
          body.isHot === "true"
            ? true
            : body.isHot === "false"
            ? false
            : match.isHot,
      };

      // Update match
      const updatedMatch = await Match.findByIdAndUpdate(
        req.params.id,
        updateData,
        {
          new: true,
          runValidators: true,
        }
      )
        .populate("homeTeam", "name logo")
        .populate("awayTeam", "name logo")
        .populate("league", "name logo")
        .populate("sport", "name icon slug")
        .populate("streamLinks.commentator", "username avatar");

      if (!updatedMatch) {
        res.status(404).json({ message: "Không tìm thấy trận đấu" });
        return;
      }

      // Delete old files
      for (const filePath of oldFiles) {
        try {
          await fs.unlink(filePath);
        } catch (err) {
          console.error(`Lỗi khi xóa file cũ: ${filePath}`, err);
        }
      }

      res.status(200).json(updatedMatch);
    } catch (error: any) {
      console.error("Update match error:", error);
      res.status(500).json({ message: "Lỗi server", error: error.message });
    }
  },
];

// @desc    Xóa một trận đấu
// @route   DELETE /api/matches/:id
export const deleteMatch = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const deletedMatch = await Match.findByIdAndDelete(req.params.id);
    if (!deletedMatch) {
      res.status(404).json({ message: "Không tìm thấy trận đấu" });
      return;
    }
    // Optionally, delete associated files here
    const oldFiles: string[] = [];
    for (const link of deletedMatch.streamLinks) {
      if (link.image?.startsWith(`${baseURL}/static/`)) {
        oldFiles.push(
          path.join(__dirname, "../../assets/images", path.basename(link.image))
        );
      }
      if (link.commentatorImage?.startsWith(`${baseURL}/static/`)) {
        oldFiles.push(
          path.join(
            __dirname,
            "../../assets/images",
            path.basename(link.commentatorImage)
          )
        );
      }
    }

    for (const filePath of oldFiles) {
      try {
        await fs.unlink(filePath);
      } catch (err) {
        console.error(`Lỗi khi xóa file cũ: ${filePath}`, err);
      }
    }
    res.status(200).json({ message: "Đã xóa trận đấu thành công" });
  } catch (error) {
    console.error("Delete match error:", error);
    res.status(500).json({ message: "Lỗi server", error });
  }
};
