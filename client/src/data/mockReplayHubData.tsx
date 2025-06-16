import * as React from "react";
import {
  FeaturedBroadcastItem,
  HighlightedEventInfo,
  CategorizedReplayGroup,
  Replay,
} from "../types/replay.types";
import {
  StarIcon,
  FootballIcon,
  TennisIcon,
  BasketballIcon,
  VolleyballIcon,
} from "@/components/layout/Icon";

const placeholderImg = (
  seed: string,
  width: number = 100,
  height: number = 140
) => `https://picsum.photos/seed/${seed}/${width}/${height}`;
const placeholderThumbnail = (
  seed: string,
  width: number = 300,
  height: number = 160
) => `https://picsum.photos/seed/${seed}/${width}/${height}`;

export const mockFeaturedBroadcasts: FeaturedBroadcastItem[] = [
  {
    id: "fb1",
    playerImage: placeholderImg("tommy_paul"),
    playerName: "Tommy Paul",
    time: "16:00 ---",
    opponentName: "Alexei Popyrin",
    commentator: "Người Cũn",
  },
  {
    id: "fb2",
    playerImage: placeholderImg("carlos_alcaraz"),
    playerName: "Carlos Alcaraz",
    time: "19:00 ---",
    opponentName: "Ben Shelton",
    commentator: "Mỹ Tôm",
  },
  {
    id: "fb3",
    playerImage: placeholderImg("frances_tiafoe"),
    playerName: "Frances Tiafoe",
    time: "21:00 ---",
    opponentName: "Daniel Altmaier",
    commentator: "Người Huc",
  },
  {
    id: "fb4",
    playerImage: placeholderImg("lorenzo_musetti"),
    playerName: "Lorenzo Musetti",
    time: "01:15 ---",
    opponentName: "Holger Rune",
    commentator: "Trp Sbr",
  },
  {
    id: "fb5",
    playerImage: placeholderImg("iga_swiatek"),
    playerName: "Iga Swiatek",
    time: "14:00 ---",
    opponentName: "Aryna Sabalenka",
    commentator: "BLV TennisPro",
  },
];

export const mockHighlightedEventData: HighlightedEventInfo = {
  playerImages: [
    placeholderImg("ben_shelton_small", 80, 110),
    placeholderImg("carlos_alcaraz_small", 80, 110),
    placeholderImg("holger_rune_small", 80, 110),
  ],
  description: "Tennis Roland Garros Carlos Alcaraz vs Ben Shelton",
  commentatorInfo: "BLV Mỹ Tôm | 01.06.25",
  dateDisplay: "01/06",
};

export const mockCategorizedReplays: CategorizedReplayGroup[] = [
  {
    id: "special_events",
    title: "SỰ KIỆN ĐẶC BIỆT",
    icon: React.createElement(StarIcon, {
      className: "w-5 h-5 text-yellow-400",
    }),
    replays: [
      {
        id: "se1",
        title: "Khai mạc Olympic Paris 2024 | BLV Người Hùng | 27.7.24",
        sportType: "Sự kiện đặc biệt",
        date: "28/07/2024",
        thumbnailUrl: placeholderThumbnail("olympic_paris"),
        duration: "3:15:00",
      },
      {
        id: "se2",
        title: "Trận tranh Super Bowl 2024 | BLV Người Hảo | 12.2.24",
        sportType: "Sự kiện đặc biệt",
        date: "13/02/2024",
        thumbnailUrl: placeholderThumbnail("super_bowl"),
        duration: "4:30:10",
      },
      {
        id: "se3",
        title: "Trao giải Quả Bóng Vàng 2023 - MESSI lần 8 | 31.10.23",
        sportType: "Sự kiện đặc biệt",
        date: "01/11/2023",
        thumbnailUrl: placeholderThumbnail("ballon_dor"),
        duration: "1:45:30",
      },
      {
        id: "se4",
        title: "Chung kết CKTG 2023 T1 vs WBG | BLV Văn Tùng | 19.11.23",
        sportType: "eSports",
        date: "20/11/2023",
        thumbnailUrl: placeholderThumbnail("worlds_lol"),
        duration: "5:12:55",
      },
    ],
    viewAllUrl: "#",
  },
  {
    id: "football",
    title: "BÓNG ĐÁ",
    icon: React.createElement(FootballIcon, {
      className: "w-5 h-5 text-green-400",
    }),
    replays: [
      {
        id: "fb_rep1",
        title: "Fullmatch Asia Championships 2025 | BLV Thit Xiên | 11.4.25",
        sportType: "Bóng đá",
        date: "12/04/2025",
        thumbnailUrl:
          "https://via.placeholder.com/300x160/1A202C/FFFFFF?text=Asia+Champs",
        duration: "2:05:30",
      },
      {
        id: "fb_rep2",
        title: "Fullmatch Everton vs Man United | BLV Bún Chả | 22.2.25",
        sportType: "Bóng đá",
        date: "23/02/2025",
        thumbnailUrl:
          "https://via.placeholder.com/300x160/2D3748/FFFFFF?text=Everton+vs+ManU",
        duration: "1:58:10",
      },
      {
        id: "fb_rep3",
        title: "Full match Las Palmas vs Barcelona | BLV Người Cũn | 23.2.25",
        sportType: "Bóng đá",
        date: "23/02/2025",
        thumbnailUrl:
          "https://via.placeholder.com/300x160/4A5568/FFFFFF?text=LasPalmas+vs+Barca",
        duration: "2:10:00",
      },
      {
        id: "fb_rep4",
        title: "Full match Arsenal vs West Ham | BLV Người Cũn | 23.2.25",
        sportType: "Bóng đá",
        date: "23/02/2025",
        thumbnailUrl:
          "https://via.placeholder.com/300x160/2C5282/FFFFFF?text=Arsenal+vs+WestHam",
        duration: "2:02:45",
      },
    ],
    viewAllUrl: "#",
  },
  {
    id: "tennis",
    title: "TENNIS",
    icon: React.createElement(TennisIcon, {
      className: "w-5 h-5 text-lime-400",
    }),
    replays: [
      {
        id: "tn1",
        title:
          "Tennis Roland Garros: Carlos Alcaraz vs Ben Shelton | BLV Mỹ Tôm | 01.06.25",
        sportType: "Tennis",
        date: "01/06/2025",
        thumbnailUrl: placeholderThumbnail("alcaraz_shelton_tennis"),
        commentator: "BLV Mỹ Tôm",
        duration: "2:45:15",
      },
      {
        id: "tn2",
        title:
          "Tennis Roland Garros: Iga Swiatek vs Elena Rybakina | BLV Người Mìn | 01.06.25",
        sportType: "Tennis",
        date: "01/06/2025",
        thumbnailUrl: placeholderThumbnail("swiatek_rybakina_tennis"),
        commentator: "BLV Người Mìn",
        duration: "1:55:00",
      },
      {
        id: "tn3",
        title:
          "Tennis Roland Garros: Aryna Sabalenka vs Amanda Anisimova | BLV Ngộ Gió | 01.06.25",
        sportType: "Tennis",
        date: "01/06/2025",
        thumbnailUrl: placeholderThumbnail("sabalenka_anisimova_tennis"),
        commentator: "BLV Ngộ Gió",
        duration: "2:10:30",
      },
      {
        id: "tn4",
        title:
          "Tennis Roland Garros: Jannik Sinner vs Felix Auger-Aliassime | BLV Pro | 31.05.25",
        sportType: "Tennis",
        date: "31/05/2025",
        thumbnailUrl: placeholderThumbnail("sinner_felix_tennis"),
        commentator: "BLV Pro",
        duration: "3:02:00",
      },
    ],
    viewAllUrl: "#",
  },
  {
    id: "basketball",
    title: "BÓNG RỔ",
    icon: React.createElement(BasketballIcon, {
      className: "w-5 h-5 text-orange-400",
    }),
    replays: [
      {
        id: "bb1",
        title:
          "Chung kết NBA: Oklahoma City Thunder vs Minnesota Timberwolves (Game 7) | BLV Người Gỗ | 29.05.2025",
        sportType: "Bóng rổ",
        date: "29/05/2025",
        thumbnailUrl: placeholderThumbnail("nba_okc_min"),
        commentator: "BLV Người Gỗ",
        duration: "2:35:00",
      },
      {
        id: "bb2",
        title:
          "Chung kết NBA: Indiana Pacers vs New York Knicks (Game 6) | BLV Người Thép | 28.05.2025",
        sportType: "Bóng rổ",
        date: "28/05/2025",
        thumbnailUrl: placeholderThumbnail("nba_ind_nyk"),
        commentator: "BLV Người Thép",
        duration: "2:20:10",
      },
      {
        id: "bb3",
        title:
          "Chung kết NBA: Boston Celtics vs Indiana Pacers (Game 4) | BLV Người Thường | 25.05.2025",
        sportType: "Bóng rổ",
        date: "25/05/2025",
        thumbnailUrl: placeholderThumbnail("nba_bos_ind"),
        commentator: "BLV Người Thường",
        duration: "2:40:30",
      },
      {
        id: "bb4",
        title:
          "NBA Regular Season: Lakers vs Warriors Highlights | BLV AllStar | 15.04.2025",
        sportType: "Bóng rổ",
        date: "15/04/2025",
        thumbnailUrl: placeholderThumbnail("nba_lak_gsw"),
        commentator: "BLV AllStar",
        duration: "0:45:00",
      },
    ],
    viewAllUrl: "#",
  },
  {
    id: "volleyball",
    title: "BÓNG CHUYỀN",
    icon: React.createElement(VolleyballIcon, {
      className: "w-5 h-5 text-sky-400",
    }),
    replays: [
      {
        id: "vb1",
        title:
          "VNL 2025: Việt Nam vs Thái Lan | BLV Chuyên Nghiệp | 15.07.2025",
        sportType: "Bóng chuyền",
        date: "15/07/2025",
        thumbnailUrl: placeholderThumbnail("vnl_vn_th"),
        commentator: "BLV Chuyên Nghiệp",
        duration: "1:50:00",
      },
      {
        id: "vb2",
        title: "VNL 2025: Brazil vs Japan | BLV Nhanh Nhẹn | 16.07.2025",
        sportType: "Bóng chuyền",
        date: "16/07/2025",
        thumbnailUrl: placeholderThumbnail("vnl_bra_jpn"),
        commentator: "BLV Nhanh Nhẹn",
        duration: "2:05:30",
      },
      {
        id: "vb3",
        title: "Club World Championship Final | BLV Đỉnh Cao | 10.12.2024",
        sportType: "Bóng chuyền",
        date: "10/12/2024",
        thumbnailUrl: placeholderThumbnail("vnl_club_final"),
        commentator: "BLV Đỉnh Cao",
        duration: "2:15:45",
      },
    ],
    viewAllUrl: "#",
  },
];

export const mockSidebarReplaysForHub: Replay[] = [
  {
    id: "side_hub1",
    title:
      "Tennis Roland Garros Iga Swiatek vs Elena Rybakina | BLV Người Mìn | 01.06.25",
    sportType: "TENNIS",
    date: "01/06/2025",
    thumbnailUrl:
      "https://via.placeholder.com/120x70/667EEA/FFFFFF?text=Tennis1",
    duration: "1:55:20",
  },
  {
    id: "side_hub2",
    title:
      "Tennis Roland Garros Aryna Sabalenka vs Amanda Anisimova | BLV Ngộ Gió | 01.06.25",
    sportType: "TENNIS",
    date: "01/06/2025",
    thumbnailUrl:
      "https://via.placeholder.com/120x70/ED64A6/FFFFFF?text=Tennis2",
    duration: "2:10:00",
  },
  {
    id: "side_hub3",
    title:
      "Tennis Roland Garros Jannik Sinner vs Felix Auger | BLV Mít Ú | 31.05.25",
    sportType: "TENNIS",
    date: "31/05/2025",
    thumbnailUrl:
      "https://via.placeholder.com/120x70/F56565/FFFFFF?text=Tennis3",
    duration: "3:02:15",
  },
  {
    id: "side_hub4",
    title: "Formula 1 Spanish GP 2025 RACE | BLV Người Nói | 01.06.25",
    sportType: "ĐUA XE",
    date: "01/06/2025",
    thumbnailUrl:
      "https://via.placeholder.com/120x70/48BB78/FFFFFF?text=F1Race",
    duration: "2:40:50",
  },
  {
    id: "side_hub5",
    title:
      "Tennis Roland Garros Novak Djokovic vs Filip Misolic | BLV Người Chơi | 31.05.25",
    sportType: "TENNIS",
    date: "31/05/2025",
    thumbnailUrl:
      "https://via.placeholder.com/120x70/ECC94B/000000?text=Tennis4",
    duration: "1:40:00",
  },
  {
    id: "side_hub6",
    title:
      "Tennis Roland Garros Carlos Alcaraz vs Ben Shelton | BLV Mỹ Tôm | 01.06.25",
    sportType: "TENNIS",
    date: "01/06/2025",
    thumbnailUrl:
      "https://via.placeholder.com/120x70/9F7AEA/FFFFFF?text=Tennis5",
    duration: "2:50:30",
  },
];
