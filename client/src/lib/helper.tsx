import {
  ChartBarIcon,
  ChartPieIcon,
  DocumentCheckIcon,
  Square2StackIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";
import mic from "@/assets/user/mic.png";
import book from "@/assets/user/book.png";
import dictionary from "@/assets/user/dictionary.png";
import coach from "@/assets/user/coach.png";
import setting_explore from "@/assets/user/setting_explore.png";
import ai from "@/assets/user/AI.jpg";
import arrange from "@/assets/user/arrange.png";
import fill_out from "@/assets/user/fill_out.png";
import pronuciation from "@/assets/user/pronunciation.png";
import headphone from "@/assets/user/headphone.png";
import emphasize from "@/assets/user/emphasize.png";
import letter from "@/assets/user/letter.png";
import play from "@/assets/user/play.png";
import intonation from "@/assets/user/intonation.png";

type Feature = {
  title: string;
  description: string;
  icon: string;
};

type GameType = {
  title: string;
  icon: string;
  colorBackground?: string;
};
export const items = [
  {
    id: 1,
    name: "Dashboard",
    icon: <ChartBarIcon className="stroke-inherit stroke-[0.75] min-w-8 w-8" />,
  },
  {
    id: 2,
    name: "Projects",
    icon: (
      <Square2StackIcon className="stroke-inherit stroke-[0.75] min-w-8 w-8" />
    ),
  },
  {
    id: 3,
    name: "Tasks",
    icon: (
      <DocumentCheckIcon className="stroke-inherit stroke-[0.75] min-w-8 w-8" />
    ),
  },
  {
    id: 4,
    name: "Reporting",
    icon: <ChartPieIcon className="stroke-inherit stroke-[0.75] min-w-8 w-8" />,
  },
  {
    id: 5,
    name: "Users",
    icon: <UsersIcon className="stroke-inherit stroke-[0.75] min-w-8 w-8" />,
  },
];

export const features: Feature[] = [
  {
    title: "Phân tích giọng nói",
    description:
      "Đánh giá khả năng nói tự do của bạn và nhận phản hồi về các kỹ năng",
    icon: mic,
  },
  {
    title: "Bộ bài học",
    description:
      "Tạo các bộ bài học của riêng bạn, hoặc khám phá các bộ được tạo bởi những người dùng khác",
    icon: book,
  },
  {
    title: "Từ điển",
    description: "Tra nghĩa và cách phát âm đúng của bất kỳ từ hay cụm từ nào",
    icon: dictionary,
  },
  {
    title: "Huấn luyện viên",
    description:
      "Luyện các bài học do nhà cung cấp đề xuất dựa trên tiến trình của bạn",
    icon: coach,
  },
  {
    title: "Công cụ tìm kiếm khoá học",
    description:
      "Lọc nội dung của Speak up để tìm kiếm bài học phù hợp với bạn nhất",
    icon: setting_explore,
  },
];

export const gameTypes: GameType[] = [
  { title: "AI", icon: ai },
  { title: "Sắp xếp lại từ", icon: arrange },
  { title: "Điền vào ô trống", icon: fill_out },
  {
    title: "Phát âm",
    icon: pronuciation,
    colorBackground: "blue-500",
  },
  { title: "Ngữ điệu", icon: intonation, colorBackground: "orange-500" },
  { title: "Nghe", icon: headphone },
  { title: "Nhấn âm", icon: emphasize, colorBackground: "green-500" },
  { title: "Hội thoại", icon: letter, colorBackground: "blue-500" },
  { title: "Video hội thoại", icon: play, colorBackground: "pink-500" },
];
