const mongoose = require("mongoose");
const axios = require("axios");

import Team from "./src/models/team.model";
import League from "./src/models/league.model";
import Sport from "./src/models/sport.model";

// Định nghĩa enum MatchStatus
import Match, { MatchStatus } from "./src/models/match.model";

// Kết nối MongoDB
mongoose
  .connect(
    "mongodb+srv://tanquanga6k10:CpdAVLjkbtX5chAq@shopdientu.l5fgtvm.mongodb.net/shopdientu?retryWrites=true&w=majority",
    {
      dbName: "hoiquantv",
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err: any) => {
    console.error("MongoDB connection error:", err);
  });

// Hàm tạo slug từ tên
const createSlug = (name: string) => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
};

// Hàm ánh xạ trạng thái API sang MatchStatus enum
const mapStatus = (statusVi: string) => {
  switch (statusVi) {
    case "Kết thúc":
      return MatchStatus.FINISHED;
    case "Chưa bắt đầu":
      return MatchStatus.UPCOMING;
    case "Hoãn":
      return MatchStatus.POSTPONED;
    default:
      return MatchStatus.UPCOMING;
  }
};

// Hàm seed dữ liệu
const seedData = async () => {
  try {
    // Gọi API
    const response = await axios.get(
      "https://api.livestats.online/api/v1/fixtures",
      {
        headers: {
          "Access-Token": "AB321C",
        },
      }
    );

    const fixtures = response.data.results;

    // Tạo hoặc lấy Sport (mặc định là Football)
    let sport = await Sport.findOne({ slug: "football" });

    // Xử lý từng fixture
    for (const fixture of fixtures) {
      // 1. Xử lý League
      let league = await League.findOne({
        slug: createSlug(fixture.league.name),
      });
      if (!league) {
        league = await League.create({
          name: fixture.league.name,
          slug: createSlug(fixture.league.name),
          logo: fixture.league.logo,
          sport: sport?._id,
        });
        console.log(`Created League: ${fixture.league.name}`);
      }

      // 2. Xử lý Home Team
      let homeTeam = await Team.findOne({
        slug: createSlug(fixture.homeTeam.name),
      });
      if (!homeTeam) {
        homeTeam = await Team.create({
          name: fixture.homeTeam.name,
          slug: createSlug(fixture.homeTeam.name),
          logo: fixture.homeTeam.logo,
          sport: sport?._id,
        });
        console.log(`Created Home Team: ${fixture.homeTeam.name}`);
      }

      // 3. Xử lý Away Team
      let awayTeam = await Team.findOne({
        slug: createSlug(fixture.awayTeam.name),
      });
      if (!awayTeam) {
        awayTeam = await Team.create({
          name: fixture.awayTeam.name,
          slug: createSlug(fixture.awayTeam.name),
          logo: fixture.awayTeam.logo,
          sport: sport?._id,
        });
        console.log(`Created Away Team: ${fixture.awayTeam.name}`);
      }

      // 4. Xử lý Match
      let match = await Match.findOne({ slug: fixture.slug });
      if (!match) {
        match = await Match.create({
          title: fixture.title,
          slug: fixture.slug,
          homeTeam: homeTeam._id,
          awayTeam: awayTeam._id,
          league: league._id,
          sport: sport?._id,
          startTime: new Date(fixture.start_date_formatted),
          status: mapStatus(fixture.status_vi),
          scores: {
            homeScore: fixture.home_score || 0,
            awayScore: fixture.away_score || 0,
          },
          streamLinks: [], // API không cung cấp streamLinks
          isHot: false, // Mặc định
        });
        console.log(`Created Match: ${fixture.title}`);
      } else {
        // Cập nhật match nếu cần
        match.status = mapStatus(fixture.status_vi);
        match.scores = {
          homeScore: fixture.home_score || 0,
          awayScore: fixture.away_score || 0,
        };
        await match.save();
        console.log(`Updated Match: ${fixture.title}`);
      }
    }

    console.log("Seeding completed!");
  } catch (error: any) {
    console.error("Error seeding data:", error.message);
  } finally {
    mongoose.connection.close();
  }
};

// Chạy hàm seed
seedData();
