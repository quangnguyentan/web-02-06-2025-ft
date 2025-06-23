// seed.ts
import mongoose from "mongoose";
import axios from "axios";
import cron from "node-cron";
import Sport from "./src/models/sport.model";
import League from "./src/models/league.model";
import Team from "./src/models/team.model";
import Match, { MatchStatus } from "./src/models/match.model";
import User from "./src/models/user.model";
import Replay from "./src/models/replay.model";
import { connectDB } from "./src/configs/connectDB";

// Định nghĩa interface cho dữ liệu API
interface ApiMatch {
  id: number;
  type: string;
  referenceId: string;
  slug: string;
  title: string;
  tournamentName: string;
  homeClub: { name: string; logoUrl: string };
  awayClub: { name: string; logoUrl: string };
  startTime: string;
  commentator: {
    id: number;
    username: string;
    email: string | null;
    phoneNumber: string;
    password: string;
    fullName: string;
    nickname: string;
    gender: string;
    avatarUrl: string;
    coverUrl: string | null;
    bio: string | null;
    status: string;
    role: string;
    createdAt: string;
    updatedAt: string;
  };
  streams: Array<{
    id: number;
    name: string;
    sourceType: string;
    sourceUrl: string;
    createdAt: string;
    updatedAt: string;
  }>;
  articleUrl: string;
  isHot: boolean;
  isPinned: boolean;
  createdAt: string;
  updatedAt: string;
}

// Hàm tạo slug từ tên
const createSlug = (name: string): string => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
};

// Hàm ánh xạ trạng thái API sang MatchStatus enum
const mapStatus = (startTime: string): MatchStatus => {
  const now = new Date(); // Sử dụng thời gian thực tế (07:24 PM +07, 23/06/2025)
  const matchTime = new Date(startTime);
  if (matchTime > now) return MatchStatus.UPCOMING;
  if (
    matchTime < now &&
    now < new Date(matchTime.getTime() + 2 * 60 * 60 * 1000)
  ) {
    return MatchStatus.LIVE;
  }
  return MatchStatus.FINISHED;
};

// Hàm xử lý dữ liệu từ API
const processApiData = async (matches: ApiMatch[]) => {
  try {
    let sport = await Sport.findOne({ slug: "football" });
    if (!sport) {
      sport = await Sport.create({
        name: "Football",
        slug: "football",
        icon: "http://localhost:8080/static/1750393380140-735399985.png",
        order: 1,
      });
      console.log("Created Sport: Football");
    }

    const commentators = new Set(
      matches
        .filter((match) => match.commentator)
        .map((match) => ({
          id: match.commentator.id,
          username: match.commentator.username,
          nickname: match.commentator.nickname,
          gender: match.commentator.gender,
          avatar: match.commentator.avatarUrl,
          password: match.commentator.password,
          createdAt: match.commentator.createdAt,
          updatedAt: match.commentator.updatedAt,
        }))
    );

    for (const commentator of commentators) {
      let user = await User.findOne({ username: commentator.nickname });
      if (!user) {
        user = await User.create({
          typeLogin: "phone",
          id: commentator.id.toString(),
          tokenLogin: "",
          username: commentator.nickname,
          firstname: commentator.nickname.split(" ").slice(0, -1).join(" "),
          lastname: commentator.nickname.split(" ").pop(),
          phone: "",
          password: commentator.password,
          refreshToken: "",
          avatar: commentator.avatar,
          role: "COMMENTATOR",
          level: 0,
          address: "",
          gender: commentator.gender,
          createdAt: new Date(commentator.createdAt),
          updatedAt: new Date(commentator.updatedAt),
        });
        console.log(`Created User: ${commentator.username}`);
      }
    }

    const leagues = new Set(
      matches.map((match) => ({
        name: match.tournamentName,
        slug: createSlug(match.tournamentName),
      }))
    );

    for (const leagueData of leagues) {
      let league = await League.findOne({ slug: leagueData.slug });
      if (!league) {
        league = await League.create({
          name: leagueData.name,
          slug: leagueData.slug,
          logo: "",
          sport: sport._id,
        });
        console.log(`Created League: ${leagueData.name}`);
      }
    }

    const teams = new Set(
      matches.flatMap((match) => [
        { name: match.homeClub.name, logo: match.homeClub.logoUrl },
        { name: match.awayClub.name, logo: match.awayClub.logoUrl },
      ])
    );

    for (const teamData of teams) {
      let team = await Team.findOne({ slug: createSlug(teamData.name) });
      if (!team) {
        team = await Team.create({
          name: teamData.name,
          slug: createSlug(teamData.name),
          logo: teamData.logo,
          sport: sport._id,
        });
        console.log(`Created Team: ${teamData.name}`);
      }
    }

    for (const matchData of matches) {
      console.log(
        `Processing match: ${matchData.title}, referenceId: ${matchData.referenceId}, slug: ${matchData.slug}`
      ); // Debug log
      const league = await League.findOne({
        slug: createSlug(matchData.tournamentName),
      });
      const homeTeam = await Team.findOne({
        slug: createSlug(matchData.homeClub.name),
      });
      const awayTeam = await Team.findOne({
        slug: createSlug(matchData.awayClub.name),
      });
      const commentator = await User.findOne({
        username: matchData.commentator?.username,
      });

      // Kiểm tra cả referenceId và slug để tránh tạo trùng
      let match = await Match.findOne({
        $or: [{ referenceId: matchData.referenceId }, { slug: matchData.slug }],
      });

      if (!match) {
        // Tạo mới chỉ khi không có referenceId hoặc slug trong DB
        match = await Match.create({
          referenceId: matchData.referenceId,
          title: matchData.title,
          slug: matchData.slug, // Sử dụng slug từ API
          homeTeam: homeTeam?._id,
          awayTeam: awayTeam?._id,
          league: league?._id,
          sport: sport._id,
          startTime: new Date(matchData.startTime),
          status: mapStatus(matchData.startTime),
          scores: { homeScore: 0, awayScore: 0 },
          streamLinks: matchData.streams.map((stream) => ({
            label: stream.name,
            url: stream.sourceUrl,
            image: `https://res.klook.com/image/upload/c_fill,w_1265,h_712/q_80/w_80,x_15,y_15,g_south_west,l_Klook_water_br_trans_yhcmh3/activities/gjam3n7jvltkpo5wxktb.webp`,
            commentator: commentator?._id,
            commentatorImage: commentator?.avatar,
            priority: 1,
          })),
          isHot: matchData.isHot,
        });
        console.log(
          `Created Match: ${matchData.title} with slug: ${matchData.slug}`
        );
      } else {
        // Cập nhật nếu có thay đổi
        const newStatus = mapStatus(matchData.startTime);
        const currentStreamLinks = match.streamLinks.map((link) => ({
          label: link.label,
          url: link.url,
          image: link.image,
          commentator: link.commentator?.toString(),
          commentatorImage: link.commentatorImage,
          priority: link.priority,
        }));
        const newStreamLinks = matchData.streams.map((stream) => ({
          label: stream.name,
          url: stream.sourceUrl,
          image: `https://res.klook.com/image/upload/c_fill,w_1265,h_712/q_80/w_80,x_15,y_15,g_south_west,l_Klook_water_br_trans_yhcmh3/activities/gjam3n7jvltkpo5wxktb.webp`,
          commentator: commentator?._id?.toString(),
          commentatorImage: commentator?.avatar,
          priority: 1,
        }));

        const hasChanged =
          match.title !== matchData.title ||
          match.startTime.getTime() !== new Date(matchData.startTime).getTime() ||
          match.status !== newStatus ||
          match.isHot !== matchData.isHot ||
          JSON.stringify(currentStreamLinks) !== JSON.stringify(newStreamLinks);

        if (hasChanged) {
          match.title = matchData.title;
          match.startTime = new Date(matchData.startTime);
          match.status = newStatus;
          match.streamLinks = newStreamLinks as any; // Type assertion to match schema
          match.isHot = matchData.isHot;
          await match.save();
          console.log(
            `Updated Match: ${matchData.title} (Status: ${match.status} -> ${newStatus})`
          );
        } else {
          console.log(`No changes for Match: ${matchData.title}`);
        }
      }

      let replay = await Replay.findOne({ slug: `${matchData.slug}-replay` });
      if (!replay) {
        replay = await Replay.create({
          title: `${matchData.title} - Replay`,
          slug: `${matchData.slug}-replay`,
          description: `Replay of the match between ${matchData.homeClub.name} and ${matchData.awayClub.name}`,
          videoUrl: `https://example.com/replays/${matchData.slug}.mp4`,
          thumbnail: `https://res.klook.com/image/upload/c_fill,w_1265,h_712/q_80/w_80,x_15,y_15,g_south_west,l_Klook_water_br_trans_yhcmh3/activities/gjam3n7jvltkpo5wxktb.webp`,
          match: match._id,
          sport: sport._id,
          commentator: matchData.commentator?.nickname,
          views: 0,
          duration: 7200,
          publishDate: new Date(matchData.startTime),
          isShown: true,
        });
        console.log(`Created Replay: ${matchData.title} - Replay`);
      }
    }
  } catch (error: any) {
    console.error("Error processing API data:", error.message);
  }
};

// Hàm gọi API định kỳ
export async function startPolling() {
  try {
    await connectDB(); // Sử dụng kết nối chung
    console.log("Polling started");

    const response = await axios.get(
      "https://sv.bugiotv.xyz/internal/api/matches"
    );
    const matches: ApiMatch[] = response.data.data;
    await processApiData(matches);

    cron.schedule("*/60 * * * * *", async () => {
      try {
        console.log("Polling API...");
        const response = await axios.get(
          "https://sv.bugiotv.xyz/internal/api/matches"
        );
        const matches: ApiMatch[] = response.data.data;
        await processApiData(matches);
      } catch (error: any) {
        console.error("Error polling API:", error.message);
      }
    });
  } catch (error: any) {
    console.error("Error starting polling:", error.message);
    await mongoose.connection.close();
    console.log("MongoDB connection closed");
  }
}