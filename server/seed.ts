import axios from "axios";
import * as cheerio from "cheerio";
import mongoose, { Types } from "mongoose";
import puppeteer from "puppeteer";

// Import các models của bạn
import Sport, { ISport } from "./src/models/sport.model";
import League, { ILeague } from "./src/models/league.model";
import Team, { ITeam } from "./src/models/team.model";
import Match, { IMatch, MatchStatus } from "./src/models/match.model";

// --- CẤU HÌNH ---
const MONGO_URI =
  "mongodb+srv://tanquanga6k10:CpdAVLjkbtX5chAq@shopdientu.l5fgtvm.mongodb.net/shopdientu?retryWrites=true&w=majority";
const BASE_URL = "https://b.thapcam73.life";

// HÀM FETCH HTML BẰNG PUPPETEER
async function fetchAndRenderHtml(
  url: string,
  selectorToWaitFor: string
): Promise<string> {
  let browser;
  try {
    browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"], // Thêm args để tương thích nhiều môi trường
    });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "networkidle2" });
    await page.waitForSelector(selectorToWaitFor, { timeout: 15000 });
    const content = await page.content();
    return content;
  } catch (error) {
    console.error(
      `Lỗi khi fetch URL bằng Puppeteer: ${url}. Có thể trang không có trận đấu.`
    );
    return "<html></html>";
  } finally {
    if (browser) await browser.close();
  }
}

// HÀM CÀO SPORTS
async function scrapeSports(): Promise<
  Omit<ISport, keyof mongoose.Document>[]
> {
  console.log("Bắt đầu cào dữ liệu các môn thể thao...");
  const html = await axios.get(BASE_URL).then((res) => res.data);
  const $ = cheerio.load(html);
  const sports: Omit<ISport, keyof mongoose.Document>[] = [];
  $("div.list-header-swiper a.nav-item").each((index, element) => {
    const sportElement = $(element);
    const name = sportElement.find("span").text().trim();
    const href = sportElement.attr("href");
    if (!href || !name || name === "Sự kiện" || name === "Môn khác") return;
    const slug = href.split("/").pop() ?? "";
    let icon = sportElement.find("img").attr("src");
    if (icon && !icon.startsWith("http")) icon = `https:${icon}`;
    sports.push({ name, slug, icon });
  });
  console.log(`✅ Đã cào được ${sports.length} môn thể thao.`);
  return sports;
}

// =======================================================
// NEW: HÀM CÀO DÀNH RIÊNG CHO TRANG CHỦ (LIVE)
// =======================================================
async function scrapeHomepageMatches(
  pageUrl: string,
  status: MatchStatus,
  sportId: Types.ObjectId
): Promise<any[]> {
  console.log(`   - Cào dữ liệu từ Trang chủ: ${pageUrl}`);
  const html = await fetchAndRenderHtml(pageUrl, "div.grid-matches"); // Selector đúng cho trang chủ
  const $ = cheerio.load(html);
  const scrapedMatches: any[] = [];
  $("div.grid-matches__item").each((index, element) => {
    const matchElement = $(element);
    const leagueName = matchElement.find(".grid-match__league").text().trim();
    const homeTeamName = matchElement
      .find(".grid-match__team-home .gname span")
      .text()
      .trim();
    const awayTeamName = matchElement
      .find(".grid-match__team-away .gname span")
      .text()
      .trim();
    const detailLink = matchElement.find("a.grid-match__body").attr("href");
    const slug = detailLink?.split("/").pop() || "";
    let startTime: Date = new Date(); // Mặc định là bây giờ cho trận LIVE
    const scoreText = matchElement.find(".result span").text().trim();
    let [homeScore, awayScore] = [0, 0];
    if (scoreText && scoreText.includes("-")) {
      [homeScore, awayScore] = scoreText
        .split("-")
        .map((s) => parseInt(s.trim(), 10) || 0);
    }
    if (leagueName && homeTeamName && awayTeamName) {
      scrapedMatches.push({
        raw: {
          leagueName,
          homeTeamName,
          awayTeamName,
          startTime,
          homeScore,
          awayScore,
          slug,
          status,
          sportId,
        },
      });
    }
  });
  console.log(
    `   - ✅ Đã cào được ${scrapedMatches.length} trận đấu từ Trang chủ.`
  );
  return scrapedMatches;
}

// =======================================================
// NEW: HÀM CÀO DÀNH RIÊNG CHO CÁC TRANG CON
// =======================================================
async function scrapeSubpageMatches(
  pageUrl: string,
  status: MatchStatus,
  sportId: Types.ObjectId
): Promise<any[]> {
  console.log(`   - Cào dữ liệu từ Trang con: ${pageUrl}`);
  const html = await fetchAndRenderHtml(pageUrl, "div.list-matches-container"); // Selector đúng cho trang con
  const $ = cheerio.load(html);
  const scrapedMatches: any[] = [];
  $("a.match-item-container").each((index, element) => {
    const matchElement = $(element);
    const leagueName = matchElement.find(".league-name").text().trim();
    const homeTeamName = matchElement
      .find(".team-home .team-name")
      .text()
      .trim();
    const awayTeamName = matchElement
      .find(".team-away .team-name")
      .text()
      .trim();
    const slug = matchElement.attr("href")?.split("/").pop() || "";
    const time = matchElement.find(".time").text().trim();
    const date = matchElement.find(".date").text().trim();
    let startTime: Date | null = null;
    if (date && time && /^\d{2}:\d{2}$/.test(time)) {
      const [day, month] = date.split("/");
      const currentYear = new Date().getFullYear();
      startTime = new Date(`${currentYear}-${month}-${day}T${time}:00`);
    } else {
      startTime = new Date(); // Dự phòng nếu không có giờ
    }
    const scoreText = matchElement
      .find(".score-container .score")
      .text()
      .trim();
    let [homeScore, awayScore] = [0, 0];
    if (scoreText && scoreText.includes("-")) {
      [homeScore, awayScore] = scoreText
        .split("-")
        .map((s) => parseInt(s.trim(), 10) || 0);
    }
    if (leagueName && homeTeamName && awayTeamName) {
      scrapedMatches.push({
        raw: {
          leagueName,
          homeTeamName,
          awayTeamName,
          startTime,
          homeScore,
          awayScore,
          slug,
          status,
          sportId,
        },
      });
    }
  });
  console.log(
    `   - ✅ Đã cào được ${scrapedMatches.length} trận đấu từ Trang con.`
  );
  return scrapedMatches;
}

async function seedDatabase() {
  try {
    await mongoose.connect(MONGO_URI, { dbName: "hoiquantv" });
    console.log("🔗 Kết nối MongoDB thành công!");
    console.log("🗑️ Xóa dữ liệu cũ...");
    await Match.deleteMany({});
    await Team.deleteMany({});
    await League.deleteMany({});
    await Sport.deleteMany({});

    const scrapedSports = await scrapeSports();
    if (scrapedSports.length === 0) {
      console.error("Không cào được môn thể thao nào, dừng script.");
      return;
    }
    const createdSports = await Sport.insertMany(scrapedSports);
    const sportMap = new Map<string, ISport>();
    createdSports.forEach((sport) => sportMap.set(sport.slug, sport));

    console.log("\n");
    let allScrapedMatches: any[] = [];
    const footballSport = sportMap.get("football");
    if (footballSport) {
      console.log(`Bắt đầu cào các trận LIVE từ trang chủ...`);
      // GỌI HÀM ĐÚNG CHO TRANG CHỦ
      const liveMatches = await scrapeHomepageMatches(
        `${BASE_URL}/`,
        MatchStatus.LIVE,
        footballSport._id as mongoose.Types.ObjectId
      );
      allScrapedMatches.push(...liveMatches);
    }
    for (const sport of createdSports) {
      console.log(`\nBắt đầu cào dữ liệu cho môn: ${sport.name}`);
      const upcomingUrl = `${BASE_URL}/lich-thi-dau/${sport.slug}`;
      const finishedUrl = `${BASE_URL}/ket-qua/${sport.slug}`;
      // GỌI HÀM ĐÚNG CHO TRANG CON
      const upcomingMatches = await scrapeSubpageMatches(
        upcomingUrl,
        MatchStatus.UPCOMING,
        sport._id as mongoose.Types.ObjectId
      );
      const finishedMatches = await scrapeSubpageMatches(
        finishedUrl,
        MatchStatus.FINISHED,
        sport._id as mongoose.Types.ObjectId
      );
      allScrapedMatches.push(...upcomingMatches, ...finishedMatches);
    }

    console.log(
      `\nTổng cộng có ${allScrapedMatches.length} trận đấu để xử lý.`
    );
    if (allScrapedMatches.length === 0) {
      console.log("Không có trận đấu nào để thêm. Dừng lại.");
      return;
    }
    const leagueMap = new Map<string, ILeague>();
    const teamMap = new Map<string, ITeam>();
    console.log("\n⏳ Bắt đầu chèn dữ liệu vào cơ sở dữ liệu...");
    for (const item of allScrapedMatches) {
      const matchData = item.raw;
      // Bỏ qua các trận không có tên đội bóng
      if (!matchData.homeTeamName || !matchData.awayTeamName) continue;

      let leagueDoc = leagueMap.get(matchData.leagueName);
      if (!leagueDoc) {
        leagueDoc = await League.create({
          name: matchData.leagueName,
          slug: matchData.leagueName
            .toLowerCase()
            .replace(/\s+/g, "-")
            .replace(/[^a-z0-9-]/g, ""),
          sport: matchData.sportId,
        });
        leagueMap.set(matchData.leagueName, leagueDoc);
      }
      let homeTeamDoc = teamMap.get(matchData.homeTeamName);
      if (!homeTeamDoc) {
        homeTeamDoc = await Team.create({
          name: matchData.homeTeamName,
          slug: matchData.homeTeamName
            .toLowerCase()
            .replace(/\s+/g, "-")
            .replace(/[^a-z0-9-]/g, ""),
          sport: matchData.sportId,
        });
        teamMap.set(matchData.homeTeamName, homeTeamDoc);
      }
      let awayTeamDoc = teamMap.get(matchData.awayTeamName);
      if (!awayTeamDoc) {
        awayTeamDoc = await Team.create({
          name: matchData.awayTeamName,
          slug: matchData.awayTeamName
            .toLowerCase()
            .replace(/\s+/g, "-")
            .replace(/[^a-z0-9-]/g, ""),
          sport: matchData.sportId,
        });
        teamMap.set(matchData.awayTeamName, awayTeamDoc);
      }
      await Match.create({
        title: `${matchData.homeTeamName} vs ${matchData.awayTeamName}`,
        slug:
          matchData.slug ||
          `${homeTeamDoc.slug}-vs-${awayTeamDoc.slug}-${Date.now()}`,
        homeTeam: homeTeamDoc._id,
        awayTeam: awayTeamDoc._id,
        league: leagueDoc._id,
        sport: matchData.sportId,
        startTime: matchData.startTime,
        status: matchData.status,
        scores: {
          homeScore: matchData.homeScore,
          awayScore: matchData.awayScore,
        },
        isHot: matchData.status === MatchStatus.LIVE,
      });
    }
    console.log("\n--- HOÀN THÀNH ---");
    console.log(`⚽ Đã tạo ${sportMap.size} môn thể thao.`);
    console.log(`🏆 Đã tạo ${leagueMap.size} giải đấu.`);
    console.log(`🛡️ Đã tạo ${teamMap.size} đội bóng.`);
    console.log(`⚔️ Đã tạo ${allScrapedMatches.length} trận đấu.`);
  } catch (error) {
    console.error("❌ Đã xảy ra lỗi trong quá trình seed:", error);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Đã ngắt kết nối MongoDB.");
  }
}

seedDatabase();
