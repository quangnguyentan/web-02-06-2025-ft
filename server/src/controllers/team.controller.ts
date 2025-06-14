import { Request, Response } from "express";
import Team, { ITeam } from "../models/team.model";
import Sport from "../models/sport.model";

// @desc    Tạo một đội mới
// @route   POST /api/teams
export const createTeam = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, slug, logo, sport } = req.body;
    const sportExists = await Sport.findById(sport);
    if (!sportExists) {
      res.status(400).json({ message: "ID Môn thể thao không hợp lệ" });
      return;
    }
    const newTeam: ITeam = new Team({ name, slug, logo, sport });
    await newTeam.save();
    res.status(201).json(newTeam);
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
    const updatedTeam = await Team.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
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
    res.status(200).json({ message: "Đã xóa đội thành công" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error });
  }
};
