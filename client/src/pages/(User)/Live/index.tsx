import { Match, Replay } from "@/types/index.types";
import MatchStreamPage from "@/components/layout/MatchStream";
import VerticalAdBanner from "@/components/layout/VerticalAdBanner";
import belt from "@/assets/user/160t1800.gif";

const currentMatchMock: Match = {
  id: "livematch1",
  sportName: "MLB",
  leagueName: "Bóng chày Mỹ",
  teamA: {
    name: "Giants",
    logoUrl: "https://via.placeholder.com/40/FFA500/000000?text=SF",
  },
  teamB: {
    name: "Padres",
    logoUrl: "https://via.placeholder.com/40/A52A2A/FFFFFF?text=SD",
  },
  scoreA: 0,
  scoreB: 0,
  time: "08:45",
  date: "03/06/2025",
  isLive: true,
  liveStatus: "LIVE",
  streamerName: "Người Phép",
  streamerAvatarUrl: "https://picsum.photos/seed/streamer/32/32",
  description:
    "Xem ThapCamTV trực tiếp trận đấu: Giants vs Padres Lúc 08:45 Ngày 03/06/2025",
  category: "Môn Khác",
  matchUrl: "#",
  betUrl: "#",
  showBetButton: true,
};

const relatedMatchesMock: Match[] = [
  {
    id: "rm1",
    sportName: "MLB",
    leagueName: "MLB: Bóng chày Mỹ",
    teamA: {
      name: "Dodgers",
      logoUrl: "https://via.placeholder.com/40/005A9C/FFFFFF?text=LAD",
    },
    teamB: {
      name: "Mets",
      logoUrl: "https://via.placeholder.com/40/FF5910/FFFFFF?text=NYM",
    },
    time: "09:10",
    date: "03/06",
    isLive: true,
    liveStatus: "LIVE",
    streamerName: "Người Cày",
    streamerAvatarUrl: "https://picsum.photos/seed/avatar4/32/32",
  },
  {
    id: "rm2",
    sportName: "Badminton",
    leagueName: "KAPAL API Indonesia Open 2025",
    teamA: {
      name: "Player A",
      logoUrl: "https://via.placeholder.com/40/FFFFFF/000000?text=PA",
    },
    teamB: {
      name: "Player B",
      logoUrl: "https://via.placeholder.com/40/0000FF/FFFFFF?text=PB",
    },
    time: "09:00",
    date: "03/06",
    isLive: true,
    liveStatus: "LIVE",
    streamerName: "Thịt Xiên",
    streamerAvatarUrl: "https://picsum.photos/seed/avatar3/32/32",
  },
  {
    id: "rm3",
    sportName: "eSports",
    leagueName: "LMHT: LPL Split 2 2025",
    teamA: {
      name: "Weibo Gaming",
      logoUrl: "https://via.placeholder.com/40/FF0000/FFFFFF?text=WBG",
    },
    teamB: {
      name: "Anyone's Legend",
      logoUrl: "https://via.placeholder.com/40/0000FF/FFFFFF?text=AL",
    },
    time: "16:00",
    date: "03/06",
    isLive: false,
    streamerName: "Người Lửa",
    streamerAvatarUrl: "https://picsum.photos/seed/avatar6/32/32",
  },
  {
    id: "rm4",
    sportName: "Football",
    leagueName: "Giao hữu",
    teamA: {
      name: "Germany (w) U19",
      logoUrl: "https://via.placeholder.com/40/000000/FFFFFF?text=GER",
    },
    teamB: {
      name: "France (w) U19",
      logoUrl: "https://via.placeholder.com/40/0055A4/FFFFFF?text=FRA",
    },
    time: "17:00",
    date: "03/06",
    isLive: false,
  },
];

const replaySuggestionsMock: Replay[] = [
  {
    id: "rs1",
    title:
      "Chung kết đỉnh cao Nữ ITTF World Championship Doha 2025 | BLV Người Mộng Mơ",
    sportType: "MÔN KHÁC",
    date: "26/05/2025",
    thumbnailUrl: "https://picsum.photos/seed/replay5/150/90",
    commentator: "Người Mộng Mơ",
    duration: "01:10:23",
  },
  {
    id: "rs2",
    title:
      "Chung kết đôi nam ITTF World Championship Chengdu 2025 | BLV Người Mộng Mơ",
    sportType: "MÔN KHÁC",
    date: "25/05/2025",
    thumbnailUrl: "https://picsum.photos/seed/replay6/150/90",
    commentator: "Người Mộng Mơ",
    duration: "02:30:00",
  },
  {
    id: "rs3",
    title:
      "Lễ duyệt binh Hải Quang Trường Sa kỷ niệm 80 năm chiến thắng Phát Xít | BLV Người Hỏi Ít",
    sportType: "MÔN KHÁC",
    date: "09/05/2025",
    thumbnailUrl: "https://picsum.photos/seed/replay7/150/90",
    commentator: "Người Hỏi Ít",
    duration: "00:45:10",
  },
  {
    id: "rs4",
    title:
      "Chung kết đôi nam WTT Champions Chongqing 2025 Wang Chuqin vs Lin Shidong | BLV Cá Sấu",
    sportType: "MÔN KHÁC",
    date: "18.03.25",
    thumbnailUrl: "https://picsum.photos/seed/replay8/150/90",
    commentator: "BLV Cá Sấu",
    duration: "01:55:05",
  },
];

const Live: React.FC = () => {
  return (
    <div>
      <VerticalAdBanner position="left" imageUrl={belt} />
      <VerticalAdBanner position="right" imageUrl={belt} />
      <MatchStreamPage
        match={currentMatchMock}
        relatedMatches={relatedMatchesMock}
        replaySuggestions={replaySuggestionsMock}
      />
    </div>
  );
};

export default Live;
