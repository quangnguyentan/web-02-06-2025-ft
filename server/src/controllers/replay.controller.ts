import { Request, Response } from "express";
import Replay, { IReplay } from "../models/replay.model";
import Match from "../models/match.model";

// @desc    Tạo một video xem lại mới
// @route   POST /api/replays
export const createReplay = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { match } = req.body;
    const matchExists = await Match.findById(match);
    if (!matchExists) {
      res.status(400).json({ message: "ID Trận đấu không hợp lệ" });
      return;
    }
    const newReplay: IReplay = new Replay(req.body);
    await newReplay.save();
    res.status(201).json(newReplay);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error });
  }
};

// @desc    Lấy tất cả video xem lại
// @route   GET /api/replays
export const getAllReplays = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const replays = await Replay.find()
      // Populate lồng nhau để lấy thông tin chi tiết của trận đấu
      .populate({
        path: "match",
        populate: [
          { path: "homeTeam", select: "name logo" },
          { path: "awayTeam", select: "name logo" },
          { path: "league", select: "name" },
        ],
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
    const replay = await Replay.findById(req.params.id).populate("match");
    if (!replay) {
      res.status(404).json({ message: "Không tìm thấy video" });
      return;
    }
    res.status(200).json(replay);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error });
  }
};

// @desc    Cập nhật một video xem lại
// @route   PUT /api/replays/:id
export const updateReplay = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const updatedReplay = await Replay.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedReplay) {
      res.status(404).json({ message: "Không tìm thấy video" });
      return;
    }
    res.status(200).json(updatedReplay);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error });
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
