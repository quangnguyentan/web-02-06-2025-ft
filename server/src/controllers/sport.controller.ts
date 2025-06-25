import { Request, Response } from "express";
import Sport, { ISport } from "../models/sport.model";
import path from "path";
import fs from "fs/promises";
import { configURL } from "../configs/configURL";

// @desc    Tạo một môn thể thao mới
// @route   POST /api/sports
export const createSport = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, slug, order } = req.body;
    const iconFile = req.file; // File uploaded via multer

    // Kiểm tra xem slug đã tồn tại chưa
    const existingSport = await Sport.findOne({ slug });
    if (existingSport) {
      res.status(409).json({ message: "Slug đã tồn tại" });
      return;
    }

    let iconUrl: string | undefined;
    if (iconFile) {
      iconUrl = `${configURL.baseURL}/images/${path.basename(iconFile.path)}`;
    }

    const newSport: ISport = new Sport({
      name,
      slug,
      icon: iconUrl,
      order: order ? Number(order) : 0,
    });
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
    const sports = await Sport.find().sort({ order: 1 });
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
    const { name, slug, order, removeIcon } = req.body;
    const iconFile = req.file;

    // Kiểm tra xem slug mới có bị trùng không (nếu có thay đổi slug)
    if (slug) {
      const existingSport = await Sport.findOne({
        slug,
        _id: { $ne: req.params.id },
      });
      if (existingSport) {
        res.status(409).json({ message: "Slug đã tồn tại" });
        return;
      }
    }

    const updateData: Partial<ISport> = {
      name,
      slug,
      order: order ? Number(order) : undefined,
    };

    // Handle icon update
    if (iconFile) {
      updateData.icon = `${configURL.baseURL}/images/${path.basename(
        iconFile.path
      )}`;
    } else if (removeIcon === "true") {
      // Delete existing icon file if it exists
      const sport = await Sport.findById(req.params.id);
      if (sport?.icon) {
        const fileName = path.basename(sport.icon);
        const filePath = path.join(__dirname, "../../assets/images", fileName);
        try {
          await fs.unlink(filePath);
        } catch (err) {
          console.error("Error deleting icon file:", err);
        }
      }
      updateData.icon = undefined;
    }

    const updatedSport = await Sport.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
        runValidators: true,
      }
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
    // Delete the icon file if it exists
    if (deletedSport.icon) {
      const fileName = path.basename(deletedSport.icon);
      const filePath = path.join(__dirname, "../../assets/images", fileName);
      try {
        await fs.unlink(filePath);
      } catch (err) {
        console.error("Error deleting icon file:", err);
      }
    }
    res.status(200).json({ message: "Đã xóa môn thể thao thành công" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error });
  }
};
