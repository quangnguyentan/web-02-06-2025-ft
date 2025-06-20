import { Request, RequestHandler, Response } from "express";
import Match, { IMatch } from "../models/match.model";
import { upload } from "../middlewares/multer";
import fs from "fs/promises";
import path from "path";

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
    { name: "mainCommentatorImage", maxCount: 1 },
    { name: "secondaryCommentatorImage", maxCount: 1 },
  ]),
  async (req: Request, res: Response): Promise<void> => {
    try {
      const body = req.body;

      // Access req.files and assert its type
      const files = req.files as
        | {
            streamLinkImages?: Express.Multer.File[];
            streamLinkCommentatorImages?: Express.Multer.File[];
            mainCommentatorImage?: Express.Multer.File[];
            secondaryCommentatorImage?: Express.Multer.File[];
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
      const mainCommentatorImage = files?.mainCommentatorImage?.[0];
      const secondaryCommentatorImage = files?.secondaryCommentatorImage?.[0];

      // Map streamLinks with uploaded files
      const processedStreamLinks = streamLinks.map(
        (link: any, index: number) => {
          if (!link.label || !link.url) {
            throw new Error("URL và nhãn stream link là bắt buộc");
          }
          return {
            label: link.label,
            url: link.url, // Treat url as a string (URL) only
            image: streamLinkImages[index]
              ? `http://localhost:8080/static/${path.basename(
                  streamLinkImages[index].path
                )}`
              : link.image || undefined,
            commentator: link.commentator || undefined,
            commentatorImage: streamLinkCommentatorImages[index]
              ? `http://localhost:8080/static/${path.basename(
                  streamLinkCommentatorImages[index].path
                )}`
              : link.commentatorImage || undefined,
            priority: link.priority ? Number(link.priority) : 1,
          };
        }
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
        status: body.status,
        scores: body.scores
          ? typeof body.scores === "string"
            ? JSON.parse(body.scores)
            : body.scores
          : { homeScore: 0, awayScore: 0 },
        streamLinks: processedStreamLinks,
        isHot: body.isHot === "true",
        mainCommentator: body.mainCommentator || undefined,
        mainCommentatorImage: mainCommentatorImage
          ? `http://localhost:8080/static/${path.basename(
              mainCommentatorImage.path
            )}`
          : undefined,
        secondaryCommentator: body.secondaryCommentator || undefined,
        secondaryCommentatorImage: secondaryCommentatorImage
          ? `http://localhost:8080/static/${path.basename(
              secondaryCommentatorImage.path
            )}`
          : undefined,
      };

      const newMatch = new Match(matchData);
      await newMatch.save();

      // Populate after saving
      const populatedMatch = await Match.findById(newMatch._id)
        .populate("homeTeam", "name logo")
        .populate("awayTeam", "name logo")
        .populate("league", "name logo")
        .populate("sport", "name icon slug");

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
      .populate("sport", "name icon slug");

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
      .populate("sport", "name icon slug");

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
    { name: "mainCommentatorImage", maxCount: 1 },
    { name: "secondaryCommentatorImage", maxCount: 1 },
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
            mainCommentatorImage?: Express.Multer.File[];
            secondaryCommentatorImage?: Express.Multer.File[];
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
      const mainCommentatorImage = files?.mainCommentatorImage?.[0];
      const secondaryCommentatorImage = files?.secondaryCommentatorImage?.[0];

      // Collect old file paths for deletion
      const oldFiles: string[] = [];

      // Add old streamLinks files to oldFiles if they are being replaced
      for (const link of match.streamLinks) {
        if (link.image?.startsWith("http://localhost:8080/static/")) {
          oldFiles.push(
            path.join(
              __dirname,
              "../../assets/images",
              path.basename(link.image)
            )
          );
        }
        if (
          link.commentatorImage?.startsWith("http://localhost:8080/static/")
        ) {
          oldFiles.push(
            path.join(
              __dirname,
              "../../assets/images",
              path.basename(link.commentatorImage)
            )
          );
        }
      }

      // Map streamLinks with uploaded files
      const processedStreamLinks = streamLinks.map(
        (link: any, index: number) => {
          if (!link.label || !link.url) {
            throw new Error("URL và nhãn stream link là bắt buộc");
          }
          return {
            label: link.label,
            url: link.url, // Treat url as a string (URL) only
            image: streamLinkImages[index]
              ? `http://localhost:8080/static/${path.basename(
                  streamLinkImages[index].path
                )}`
              : link.image || undefined,
            commentator: link.commentator || undefined,
            commentatorImage: streamLinkCommentatorImages[index]
              ? `http://localhost:8080/static/${path.basename(
                  streamLinkCommentatorImages[index].path
                )}`
              : link.commentatorImage || undefined,
            priority: link.priority ? Number(link.priority) : 1,
          };
        }
      );

      // Handle mainCommentatorImage
      let newMainCommentatorImage = match.mainCommentatorImage;
      if (mainCommentatorImage) {
        if (
          match.mainCommentatorImage?.startsWith(
            "http://localhost:8080/static/"
          )
        ) {
          oldFiles.push(
            path.join(
              __dirname,
              "../../assets/images",
              path.basename(match.mainCommentatorImage)
            )
          );
        }
        newMainCommentatorImage = `http://localhost:8080/static/${path.basename(
          mainCommentatorImage.path
        )}`;
      } else if (body.mainCommentatorImage === "") {
        if (
          match.mainCommentatorImage?.startsWith(
            "http://localhost:8080/static/"
          )
        ) {
          oldFiles.push(
            path.join(
              __dirname,
              "../../assets/images",
              path.basename(match.mainCommentatorImage)
            )
          );
        }
        newMainCommentatorImage = undefined;
      }

      // Handle secondaryCommentatorImage
      let newSecondaryCommentatorImage = match.secondaryCommentatorImage;
      if (secondaryCommentatorImage) {
        if (
          match.secondaryCommentatorImage?.startsWith(
            "http://localhost:8080/static/"
          )
        ) {
          oldFiles.push(
            path.join(
              __dirname,
              "../../assets/images",
              path.basename(match.secondaryCommentatorImage)
            )
          );
        }
        newSecondaryCommentatorImage = `http://localhost:8080/static/${path.basename(
          secondaryCommentatorImage.path
        )}`;
      } else if (body.secondaryCommentatorImage === "") {
        if (
          match.secondaryCommentatorImage?.startsWith(
            "http://localhost:8080/static/"
          )
        ) {
          oldFiles.push(
            path.join(
              __dirname,
              "../../assets/images",
              path.basename(match.secondaryCommentatorImage)
            )
          );
        }
        newSecondaryCommentatorImage = undefined;
      }

      // Prepare update data
      const updateData: Partial<IMatch> = {
        title: body.title || match.title,
        slug: body.slug || match.slug,
        homeTeam: body.homeTeam || match.homeTeam,
        awayTeam: body.awayTeam || match.awayTeam,
        league: body.league || match.league,
        sport: body.sport || match.sport,
        startTime: body.startTime ? new Date(body.startTime) : match.startTime,
        status: body.status || match.status,
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
        mainCommentator: body.mainCommentator || match.mainCommentator,
        mainCommentatorImage: newMainCommentatorImage,
        secondaryCommentator:
          body.secondaryCommentator || match.secondaryCommentator,
        secondaryCommentatorImage: newSecondaryCommentatorImage,
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
        .populate("sport", "name icon slug");

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
      if (link.image?.startsWith("http://localhost:8080/static/")) {
        oldFiles.push(
          path.join(__dirname, "../../assets/images", path.basename(link.image))
        );
      }
      if (link.commentatorImage?.startsWith("http://localhost:8080/static/")) {
        oldFiles.push(
          path.join(
            __dirname,
            "../../assets/images",
            path.basename(link.commentatorImage)
          )
        );
      }
    }
    if (
      deletedMatch.mainCommentatorImage?.startsWith(
        "http://localhost:8080/static/"
      )
    ) {
      oldFiles.push(
        path.join(
          __dirname,
          "../../assets/images",
          path.basename(deletedMatch.mainCommentatorImage)
        )
      );
    }
    if (
      deletedMatch.secondaryCommentatorImage?.startsWith(
        "http://localhost:8080/static/"
      )
    ) {
      oldFiles.push(
        path.join(
          __dirname,
          "../../assets/images",
          path.basename(deletedMatch.secondaryCommentatorImage)
        )
      );
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
