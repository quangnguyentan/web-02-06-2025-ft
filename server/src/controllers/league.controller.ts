import { Request, Response } from "express";
import League, { ILeague } from "../models/league.model";
import Sport from "../models/sport.model";
import path from "path";
import fs from "fs/promises";
const baseURL = "http://localhost:8080";
// const baseURL = "https://sv.hoiquan.live";
// @desc    Tạo một giải đấu mới
// @route   POST /api/leagues
export const createLeague = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, slug, sport } = req.body;
    const logoFile = req.file; // File uploaded via multer

    // Validation: Kiểm tra xem sport ID có hợp lệ không
    const sportExists = await Sport.findById(sport);
    if (!sportExists) {
      res.status(400).json({ message: "ID Môn thể thao không hợp lệ" });
      return;
    }

    // Kiểm tra xem slug đã tồn tại chưa
    const existingLeague = await League.findOne({ slug });
    if (existingLeague) {
      res.status(409).json({ message: "Slug đã tồn tại" });
      return;
    }

    let logoUrl: string | undefined;
    if (logoFile) {
      logoUrl = `${baseURL}/static/${path.basename(logoFile.path)}`;
    }

    const newLeague: ILeague = new League({
      name,
      slug,
      logo: logoUrl,
      sport,
    });
    await newLeague.save();
    const populatedLeague = await League.findById(newLeague._id).populate(
      "sport"
    );
    res.status(201).json(populatedLeague);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error });
  }
};

// @desc    Lấy tất cả giải đấu
// @route   GET /api/leagues
export const getAllLeagues = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const leagues = await League.find().populate("sport");
    res.status(200).json(leagues);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error });
  }
};

// @desc    Lấy một giải đấu theo ID
// @route   GET /api/leagues/:id
export const getLeagueById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const league = await League.findById(req.params.id).populate("sport");
    if (!league) {
      res.status(404).json({ message: "Không tìm thấy giải đấu" });
      return;
    }
    res.status(200).json(league);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error });
  }
};

// @desc    Cập nhật một giải đấu
// @route   PUT /api/leagues/:id
export const updateLeague = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, slug, sport, removeLogo } = req.body;
    const logoFile = req.file;

    // Validation: Kiểm tra xem sport ID có hợp lệ không nếu được cung cấp
    if (sport) {
      const sportExists = await Sport.findById(sport);
      if (!sportExists) {
        res.status(400).json({ message: "ID Môn thể thao không hợp lệ" });
        return;
      }
    }

    // Kiểm tra xem slug mới có bị trùng không (nếu có thay đổi slug)
    if (slug) {
      const existingLeague = await League.findOne({
        slug,
        _id: { $ne: req.params.id },
      });
      if (existingLeague) {
        res.status(409).json({ message: "Slug đã tồn tại" });
        return;
      }
    }

    const updateData: Partial<ILeague> = { name, slug };
    if (sport) updateData.sport = sport;

    // Handle logo update
    if (logoFile) {
      updateData.logo = `${baseURL}/static/${path.basename(logoFile.path)}`;
    } else if (removeLogo === "true") {
      // Delete existing logo file if it exists
      const league = await League.findById(req.params.id);
      if (league?.logo) {
        const fileName = path.basename(league.logo);
        const filePath = path.join(__dirname, "../../assets/images", fileName);
        try {
          await fs.unlink(filePath);
        } catch (err) {
          console.error("Error deleting logo file:", err);
        }
      }
      updateData.logo = undefined;
    }

    const updatedLeague = await League.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate("sport");
    if (!updatedLeague) {
      res.status(404).json({ message: "Không tìm thấy giải đấu" });
      return;
    }
    res.status(200).json(updatedLeague);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error });
  }
};

// @desc    Xóa một giải đấu
// @route   DELETE /api/leagues/:id
export const deleteLeague = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const deletedLeague = await League.findByIdAndDelete(req.params.id);
    if (!deletedLeague) {
      res.status(404).json({ message: "Không tìm thấy giải đấu" });
      return;
    }
    // Delete the logo file if it exists
    if (deletedLeague.logo) {
      const fileName = path.basename(deletedLeague.logo);
      const filePath = path.join(__dirname, "../../assets/images", fileName);
      try {
        await fs.unlink(filePath);
      } catch (err) {
        console.error("Error deleting logo file:", err);
      }
    }
    res.status(200).json({ message: "Đã xóa giải đấu thành công" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error });
  }
};
