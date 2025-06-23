import { Request, Response } from "express";
import Team, { ITeam } from "../models/team.model";
import Sport from "../models/sport.model";
import path from "path";
import fs from "fs/promises";
// const baseURL = "http://localhost:8080";
const baseURL = "https://sv.hoiquan.live";

// @desc    Tạo một đội mới
// @route   POST /api/teams
export const createTeam = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, slug, sport } = req.body;
    const logoFile = req.file; // File uploaded via multer

    // Validate sport ID
    const sportExists = await Sport.findById(sport);
    if (!sportExists) {
      res.status(400).json({ message: "ID Môn thể thao không hợp lệ" });
      return;
    }

    let logoUrl: string | undefined;
    if (logoFile) {
      logoUrl = `${baseURL}/static/${path.basename(logoFile.path)}`;
    }

    const newTeam: ITeam = new Team({
      name,
      slug,
      logo: logoUrl,
      sport,
    });

    await newTeam.save();
    const populatedTeam = await Team.findById(newTeam._id).populate("sport");
    res.status(201).json(populatedTeam);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error });
  }
};

// @desc    Lấy tất cả đội
// @route   GET /api/teams
export const getAllTeams = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const teams = await Team.find().populate("sport");
    res.status(200).json(teams);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error });
  }
};

// @desc    Lấy một đội theo ID
// @route   GET /api/teams/:id
export const getTeamById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const team = await Team.findById(req.params.id).populate("sport");
    if (!team) {
      res.status(404).json({ message: "Không tìm thấy đội" });
      return;
    }
    res.status(200).json(team);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error });
  }
};

// @desc    Cập nhật một đội
// @route   PUT /api/teams/:id
export const updateTeam = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, slug, sport, removeLogo } = req.body;
    const logoFile = req.file;

    // Validate sport ID if provided
    if (sport) {
      const sportExists = await Sport.findById(sport);
      if (!sportExists) {
        res.status(400).json({ message: "ID Môn thể thao không hợp lệ" });
        return;
      }
    }

    const updateData: Partial<ITeam> = { name, slug };
    if (sport) updateData.sport = sport;

    // Handle logo update
    if (logoFile) {
      updateData.logo = `${baseURL}/static/${path.basename(logoFile.path)}`;
    } else if (removeLogo === "true") {
      // Delete existing logo file if it exists
      const team = await Team.findById(req.params.id);
      if (team?.logo) {
        const fileName = path.basename(team.logo); // Extract filename from URL
        const filePath = path.join(__dirname, "../../assets/images", fileName);
        try {
          await fs.unlink(filePath);
        } catch (err) {
          console.error("Error deleting logo file:", err);
        }
      }
      updateData.logo = undefined;
    }

    const updatedTeam = await Team.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    ).populate("sport");

    if (!updatedTeam) {
      res.status(404).json({ message: "Không tìm thấy đội" });
      return;
    }

    res.status(200).json(updatedTeam);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error });
  }
};

// @desc    Xóa một đội
// @route   DELETE /api/teams/:id
export const deleteTeam = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const deletedTeam = await Team.findByIdAndDelete(req.params.id);
    if (!deletedTeam) {
      res.status(404).json({ message: "Không tìm thấy đội" });
      return;
    }
    // Delete the logo file if it exists
    if (deletedTeam.logo) {
      const fileName = path.basename(deletedTeam.logo); // Extract filename from URL
      const filePath = path.join(__dirname, "../../assets/images", fileName);
      try {
        await fs.unlink(filePath);
      } catch (err) {
        console.error("Error deleting logo file:", err);
      }
    }
    res.status(200).json({ message: "Đã xóa đội thành công" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error });
  }
};
