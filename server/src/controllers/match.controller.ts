import { Request, Response } from "express";
import Match, { IMatch } from "../models/match.model";

// @desc    Tạo một trận đấu mới
// @route   POST /api/matches
export const createMatch = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const newMatch: IMatch = new Match(req.body);
    await newMatch.save();
    res.status(201).json(newMatch);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error });
  }
};

// @desc    Lấy tất cả trận đấu (có filter)
// @route   GET /api/matches
export const getAllMatches = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { status, sport, league } = req.query;
    const filter: any = {};
    if (status) filter.status = status;
    if (sport) filter.sport = sport;
    if (league) filter.league = league;

    const matches = await Match.find(filter)
      .populate("homeTeam", "name logo")
      .populate("awayTeam", "name logo")
      .populate("league", "name logo")
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
      .populate("homeTeam")
      .populate("awayTeam")
      .populate("league")
      .populate("sport");

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
export const updateMatch = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const updatedMatch = await Match.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedMatch) {
      res.status(404).json({ message: "Không tìm thấy trận đấu" });
      return;
    }
    res.status(200).json(updatedMatch);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error });
  }
};

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
    res.status(200).json({ message: "Đã xóa trận đấu thành công" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error });
  }
};
