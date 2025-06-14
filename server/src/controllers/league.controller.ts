import { Request, Response } from "express";
import League, { ILeague } from "../models/league.model";
import Sport from "../models/sport.model";

// @desc    Tạo một giải đấu mới
// @route   POST /api/leagues
export const createLeague = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, slug, logo, sport } = req.body;

    // Validation: Kiểm tra xem sport ID có hợp lệ không
    const sportExists = await Sport.findById(sport);
    if (!sportExists) {
      res.status(400).json({ message: "ID Môn thể thao không hợp lệ" });
      return;
    }

    const newLeague: ILeague = new League({ name, slug, logo, sport });
    await newLeague.save();
    res.status(201).json(newLeague);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error });
  }
};

// @desc    Lấy tất cả giải đấu (có thể populate sport)
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
    const updatedLeague = await League.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
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
    res.status(200).json({ message: "Đã xóa giải đấu thành công" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error });
  }
};
