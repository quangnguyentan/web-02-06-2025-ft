import { Request, Response } from "express";
import Sport, { ISport } from "../models/sport.model";

// @desc    Tạo một môn thể thao mới
// @route   POST /api/sports
export const createSport = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, slug, icon } = req.body;

    // Kiểm tra xem slug đã tồn tại chưa
    const existingSport = await Sport.findOne({ slug });
    if (existingSport) {
      res.status(409).json({ message: "Slug đã tồn tại" });
      return;
    }

    const newSport: ISport = new Sport({ name, slug, icon });
    await newSport.save();
    res.status(201).json(newSport);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error });
  }
};

// @desc    Lấy tất cả môn thể thao
// @route   GET /api/sports
export const getAllSports = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const sports = await Sport.find();
    res.status(200).json(sports);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error });
  }
};

// @desc    Lấy một môn thể thao theo ID
// @route   GET /api/sports/:id
export const getSportById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const sport = await Sport.findById(req.params.id);
    if (!sport) {
      res.status(404).json({ message: "Không tìm thấy môn thể thao" });
      return;
    }
    res.status(200).json(sport);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error });
  }
};

// @desc    Cập nhật một môn thể thao
// @route   PUT /api/sports/:id
export const updateSport = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const updatedSport = await Sport.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true } // trả về document mới và chạy validation
    );
    if (!updatedSport) {
      res.status(404).json({ message: "Không tìm thấy môn thể thao" });
      return;
    }
    res.status(200).json(updatedSport);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error });
  }
};

// @desc    Xóa một môn thể thao
// @route   DELETE /api/sports/:id
export const deleteSport = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const deletedSport = await Sport.findByIdAndDelete(req.params.id);
    if (!deletedSport) {
      res.status(404).json({ message: "Không tìm thấy môn thể thao" });
      return;
    }
    res.status(200).json({ message: "Đã xóa môn thể thao thành công" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error });
  }
};
