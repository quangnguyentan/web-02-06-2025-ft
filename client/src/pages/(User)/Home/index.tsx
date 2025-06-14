import HeroSection from "@/components/layout/HeroSection";
import SportSection from "@/components/layout/SportSection";
import ReplaySection from "@/components/layout/ReplaySection";
// import { Match, Replay } from "@/types/index.types";
import {
  FootballIcon,
  TennisIcon,
  BasketballIcon,
  EventsIcon,
} from "@/components/layout/Icon";
import * as React from "react";
import { apiGetAllMatches } from "@/services/match.services";
import { Match } from "@/types/match.types";

// const spotlightMatches: Match[] = [
//   {
//     id: "sm1",
//     sportName: "MLB",
//     leagueName: "MLB: Bóng chày Mỹ",
//     teamA: {
//       name: "Giants",
//       logoUrl: "https://via.placeholder.com/40/FFA500/000000?text=SF",
//     },
//     teamB: {
//       name: "Padres",
//       logoUrl: "https://via.placeholder.com/40/A52A2A/FFFFFF?text=SD",
//     },
//     scoreA: 0,
//     scoreB: 0,
//     time: "08:45",
//     date: "03/06",
//     isLive: true,
//     liveStatus: "LIVE",
//     streamerName: "Người Phép",
//     streamerAvatarUrl: "https://picsum.photos/seed/avatar1/32/32",
//     showBetButton: true,
//   },
//   {
//     id: "sm2",
//     sportName: "Basketball",
//     leagueName: "FIBA U16 Americas Championship",
//     teamA: {
//       name: "Mexico U16",
//       logoUrl: "https://via.placeholder.com/40/006847/FFFFFF?text=MEX",
//     },
//     teamB: {
//       name: "USA U16",
//       logoUrl: "https://via.placeholder.com/40/BF0A30/FFFFFF?text=USA",
//     },
//     scoreA: 24,
//     scoreB: 56,
//     time: "09:00",
//     date: "03/06",
//     isLive: true,
//     liveStatus: "3Q",
//     streamerName: "Bánh Cuốn",
//     streamerAvatarUrl: "https://picsum.photos/seed/avatar2/32/32",
//     showBetButton: true,
//   },
//   {
//     id: "sm3",
//     sportName: "Badminton",
//     leagueName: "KAPAL API Indonesia Open 2025",
//     teamA: {
//       name: "Player A",
//       logoUrl: "https://via.placeholder.com/40/FFFFFF/000000?text=P A",
//     },
//     teamB: {
//       name: "Player B",
//       logoUrl: "https://via.placeholder.com/40/0000FF/FFFFFF?text=P B",
//     },
//     time: "09:00",
//     date: "03/06",
//     isLive: true,
//     liveStatus: "LIVE",
//     streamerName: "Thịt Xiên",
//     streamerAvatarUrl: "https://picsum.photos/seed/avatar3/32/32",
//     showBetButton: true,
//   },
//   {
//     id: "sm4",
//     sportName: "MLB",
//     leagueName: "MLB: Bóng chày Mỹ",
//     teamA: {
//       name: "Dodgers",
//       logoUrl: "https://via.placeholder.com/40/005A9C/FFFFFF?text=LAD",
//     },
//     teamB: {
//       name: "Mets",
//       logoUrl: "https://via.placeholder.com/40/FF5910/FFFFFF?text=NYM",
//     },
//     scoreA: 0,
//     scoreB: 0,
//     time: "09:10",
//     date: "03/06",
//     isLive: true,
//     liveStatus: "LIVE",
//     streamerName: "Người Cày",
//     streamerAvatarUrl: "https://picsum.photos/seed/avatar4/32/32",
//     showBetButton: false,
//   },
//   {
//     id: "sm5",
//     sportName: "Tennis",
//     leagueName: "Roland Garros",
//     teamA: {
//       name: "Aryna Sabalenka",
//       logoUrl: "https://picsum.photos/seed/sabalenka/40/40",
//     },
//     teamB: {
//       name: "Zheng Qinwen",
//       logoUrl: "https://picsum.photos/seed/qinwen/40/40",
//     },
//     time: "16:00",
//     date: "03/06",
//     isLive: false,
//     streamerName: "Người Sắt",
//     streamerAvatarUrl: "https://picsum.photos/seed/avatar5/32/32",
//     showBetButton: true,
//   },
//   {
//     id: "sm6",
//     sportName: "eSports",
//     leagueName: "LMHT: LPL Split 2 2025",
//     teamA: {
//       name: "Weibo Gaming",
//       logoUrl: "https://via.placeholder.com/40/FF0000/FFFFFF?text=WBG",
//     },
//     teamB: {
//       name: "Anyone's Legend",
//       logoUrl: "https://via.placeholder.com/40/0000FF/FFFFFF?text=AL",
//     },
//     time: "16:00",
//     date: "03/06",
//     isLive: false,
//     streamerName: "Người Lửa",
//     streamerAvatarUrl: "https://picsum.photos/seed/avatar6/32/32",
//     showBetButton: false,
//   },
// ];

// const footballMatches: Match[] = [
//   {
//     id: "fb1",
//     sportName: "Football",
//     leagueName: "Giao hữu",
//     teamA: {
//       name: "Germany (w) U19",
//       logoUrl: "https://via.placeholder.com/40/000000/FFFFFF?text=GER",
//     },
//     teamB: {
//       name: "France (w) U19",
//       logoUrl: "https://via.placeholder.com/40/0055A4/FFFFFF?text=FRA",
//     },
//     time: "17:00",
//     date: "03/06",
//     isLive: false,
//     streamerName: "Bình Luận Viên",
//     showBetButton: false,
//   },
//   {
//     id: "fb2",
//     sportName: "Football",
//     leagueName: "V.League",
//     teamA: {
//       name: "Bình Định",
//       logoUrl: "https://via.placeholder.com/40/FFD700/000000?text=BD",
//     },
//     teamB: {
//       name: "Công An Hà Nội",
//       logoUrl: "https://via.placeholder.com/40/FF0000/FFFFFF?text=CAHN",
//     },
//     time: "18:00",
//     date: "03/06",
//     isLive: false,
//     streamerName: "Chuyên Gia",
//     showBetButton: false,
//   },
//   {
//     id: "fb3",
//     sportName: "Football",
//     leagueName: "Toulon Tournament",
//     teamA: {
//       name: "Mali U20",
//       logoUrl: "https://via.placeholder.com/40/14B53A/FFFFFF?text=MLI",
//     },
//     teamB: {
//       name: "Panama U20",
//       logoUrl: "https://via.placeholder.com/40/DA121A/FFFFFF?text=PAN",
//     },
//     time: "19:00",
//     date: "03/06",
//     isLive: false,
//     streamerName: "BLV Anh Quân",
//     showBetButton: false,
//   },
//   {
//     id: "fb4",
//     sportName: "Football",
//     leagueName: "Toulon Tournament",
//     teamA: {
//       name: "France U20",
//       logoUrl: "https://via.placeholder.com/40/0055A4/FFFFFF?text=FRA",
//     },
//     teamB: {
//       name: "Saudi Arabia U23",
//       logoUrl: "https://via.placeholder.com/40/006C35/FFFFFF?text=KSA",
//     },
//     time: "19:00",
//     date: "03/06",
//     isLive: false,
//     streamerName: "BLV Văn Tùng",
//     showBetButton: false,
//   },
// ];

// const tennisMatches: Match[] = [
//   {
//     id: "tn1",
//     sportName: "Tennis",
//     leagueName: "Roland Garros",
//     teamA: {
//       name: "Aryna Sabalenka",
//       logoUrl: "https://picsum.photos/seed/sabalenka/40/40",
//     },
//     teamB: {
//       name: "Zheng Qinwen",
//       logoUrl: "https://picsum.photos/seed/qinwen/40/40",
//     },
//     time: "16:00",
//     date: "03/06",
//     isLive: false,
//     streamerName: "Người Sắt",
//     showBetButton: false,
//   },
//   {
//     id: "tn2",
//     sportName: "Tennis",
//     leagueName: "Roland Garros",
//     teamA: {
//       name: "Elina Svitolina",
//       logoUrl: "https://picsum.photos/seed/svitolina/40/40",
//     },
//     teamB: {
//       name: "Iga Swiatek",
//       logoUrl: "https://picsum.photos/seed/swiatek/40/40",
//     },
//     time: "16:00",
//     date: "03/06",
//     isLive: false,
//     streamerName: "Người Húc",
//     showBetButton: false,
//   },
//   {
//     id: "tn3",
//     sportName: "Tennis",
//     leagueName: "Roland Garros",
//     teamA: {
//       name: "Lorenzo Musetti",
//       logoUrl: "https://picsum.photos/seed/musetti/40/40",
//     },
//     teamB: {
//       name: "Frances Tiafoe",
//       logoUrl: "https://picsum.photos/seed/tiafoe/40/40",
//     },
//     time: "17:30",
//     date: "03/06",
//     isLive: false,
//     streamerName: "Mèo Ú",
//     showBetButton: false,
//   },
// ];

// const basketballMatches: Match[] = [
//   {
//     id: "bb1",
//     sportName: "Basketball",
//     leagueName: "FIBA U16 Americas Championship",
//     teamA: {
//       name: "Mexico U16",
//       logoUrl: "https://via.placeholder.com/40/006847/FFFFFF?text=MEX",
//     },
//     teamB: {
//       name: "USA U16",
//       logoUrl: "https://via.placeholder.com/40/BF0A30/FFFFFF?text=USA",
//     },
//     scoreA: 24,
//     scoreB: 56,
//     time: "09:00",
//     date: "03/06",
//     isLive: true,
//     liveStatus: "3Q",
//     streamerName: "Bánh Cuốn",
//     showBetButton: true,
//   },
//   {
//     id: "bb2",
//     sportName: "Basketball",
//     leagueName: "Bóng rổ bán chuyên Philippines",
//     teamA: {
//       name: "Bulacan Kuyas",
//       logoUrl: "https://via.placeholder.com/40/0000FF/FFFFFF?text=BK",
//     },
//     teamB: {
//       name: "Davao Occ. Tigers",
//       logoUrl: "https://via.placeholder.com/40/FFA500/000000?text=DOT",
//     },
//     time: "15:00",
//     date: "03/06",
//     isLive: false,
//     streamerName: "Phân tích viên",
//     showBetButton: false,
//   },
// ];

// const replayItems: Replay[] = [
//   {
//     id: "r1",
//     title: "Tennis Roland Garros Carlos Alcaraz vs Ben Shelton | BLV Mỹ Tôm",
//     sportType: "TENNIS",
//     date: "01/06/25",
//     thumbnailUrl: "https://picsum.photos/seed/replay1/300/180",
//   },
//   {
//     id: "r2",
//     title: "BLV Người Húc | Tennis Roland Garros Iga Swiatek vs Elena Rybakina",
//     sportType: "TENNIS",
//     date: "01/06/25",
//     thumbnailUrl: "https://picsum.photos/seed/replay2/300/180",
//   },
//   {
//     id: "r3",
//     title:
//       "Tennis Roland Garros Aryna Sabalenka vs Amanda Anisimova | BLV Người Giời",
//     sportType: "TENNIS",
//     date: "01/06/25",
//     thumbnailUrl: "https://picsum.photos/seed/replay3/300/180",
//   },
//   {
//     id: "r4",
//     title: "BLV Mèo Ú | Tennis Roland Garros Jannik Sinner vs Mèo Ú",
//     sportType: "TENNIS",
//     date: "31/05/25",
//     thumbnailUrl: "https://picsum.photos/seed/replay4/300/180",
//   },
// ];

const App: React.FC = () => {
  const [matchData, setMatchData] = React.useState<Match[]>([]);
  const spotlightMatches = React.useMemo(() => {
    return matchData.filter((match) => match.status === "LIVE" && match?.isHot);
  }, [matchData]);

  const footballMatches = React.useMemo(() => {
    return matchData.filter((match) => match.sport.slug === "football");
  }, [matchData]);
  const tennisMatches = React.useMemo(() => {
    return matchData.filter((match) => match.sport.slug === "tennis");
  }, [matchData]);
  const basketballMatches = React.useMemo(() => {
    return matchData.filter((match) => match.sport.slug === "basketball");
  }, [matchData]);

  const getAllMatches = async () => {
    try {
      const response = await apiGetAllMatches();

      setMatchData(response.data);
    } catch (error) {
      console.error("Error fetching match data:", error);
    }
  };
  React.useEffect(() => {
    getAllMatches();
  }, []);
  return (
    <main className="flex-grow mx-auto max-w-screen-xl px-1 sm:px-3 py-2 sm:py-3 relative">
      <HeroSection />
      <SportSection
        title="TÂM ĐIỂM THỂ THAO"
        icon={<EventsIcon className="w-6 h-6" />}
        matches={spotlightMatches}
        isSpotlight
      />
      <div className="px-1 sm:px-4 md:px-6">
        <div className="bg-blue-600 text-white p-2 sm:p-3 my-3 sm:my-4 flex flex-col sm:flex-row sm:justify-between sm:items-center rounded-md gap-2 sm:gap-0">
          <img
            src="https://via.placeholder.com/200x50/FFFFFF/000000?text=ĐỐI+TÁC+CHÍNH+THỨC"
            alt="Partner Ad"
            className="h-8 sm:h-10 mx-auto sm:mx-0"
          />
          <span className="text-base sm:text-lg font-bold text-yellow-300 text-center sm:text-left">
            CLB MANCHESTER CITY TẠI CHÂU Á
          </span>
          <a
            href="#"
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-1.5 px-3 sm:py-2 sm:px-4 rounded text-xs sm:text-sm mx-auto sm:mx-0"
          >
            ĐĂNG KÝ
          </a>
        </div>
      </div>
      <SportSection
        title="BÓNG ĐÁ"
        icon={<FootballIcon className="w-6 h-6" />}
        matches={footballMatches}
        viewAllUrl="#"
      />
      <SportSection
        title="TENNIS"
        icon={<TennisIcon className="w-6 h-6" />}
        matches={tennisMatches}
        viewAllUrl="#"
      />
      <SportSection
        title="BÓNG RỔ"
        icon={<BasketballIcon className="w-6 h-6" />}
        matches={basketballMatches}
        viewAllUrl="#"
      />
      {/* <ReplaySection
        title="XEM LẠI CÁC TRẬN ĐẤU"
        replays={replayItems}
        viewAllUrl="#"
      /> */}
    </main>
  );
};

export default App;
