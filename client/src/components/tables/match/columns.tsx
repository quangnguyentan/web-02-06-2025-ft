// columns.ts
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Edit, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ModalData, ModalType } from "@/hooks/use-model-store";
import { Match } from "@/types/match.types";
import { Team } from "@/types/team.types";
import { League } from "@/types/league.types";
import { Sport } from "@/types/sport.types";

export const getColumns = (
  onOpen: (type: ModalType, data?: ModalData) => void,
  leagues: League[], // <--- Thêm tham số leagues
  teams: Team[], // <--- Thêm tham số teams
  sports: Sport[] // <--- Thêm tham số sports
): ColumnDef<Match>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected()
            ? true
            : table.getIsSomePageRowsSelected()
            ? "indeterminate"
            : false
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("title")}</div>
    ),
  },
  {
    accessorKey: "slug",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Slug
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="lowercase px-4">{row.getValue("slug")}</div>
    ),
  },
  {
    accessorKey: "homeTeam",
    header: "Home Team Name",
    cell: ({ row }) => {
      const teamData = row.original.homeTeam;
      let teamName = "N/A";
      if (
        typeof teamData === "object" &&
        teamData !== null &&
        "name" in teamData
      ) {
        teamName = (teamData as Team).name;
      } else if (typeof teamData === "string") {
        const foundTeam = teams.find((t) => t._id === teamData);
        teamName = foundTeam ? foundTeam.name : "ID: " + teamData;
      }
      return <div className="capitalize">{teamName}</div>;
    },
  },
  {
    accessorKey: "scores",
    header: "Home Team Score",
    cell: ({ row }) => (
      <div className="capitalize">
        {row.original.scores?.homeScore ?? "N/A"}
      </div>
    ),
  },
  {
    accessorKey: "awayTeam",
    header: "Away Team Name",
    cell: ({ row }) => {
      const teamData = row.original.awayTeam;
      let teamName = "N/A";
      if (
        typeof teamData === "object" &&
        teamData !== null &&
        "name" in teamData
      ) {
        teamName = (teamData as Team).name;
      } else if (typeof teamData === "string") {
        const foundTeam = teams.find((t) => t._id === teamData);
        teamName = foundTeam ? foundTeam.name : "ID: " + teamData;
      }
      return <div className="capitalize">{teamName}</div>;
    },
  },
  {
    accessorKey: "scores",
    header: "Away Team Score",
    cell: ({ row }) => (
      <div className="capitalize">
        {row.original.scores?.awayScore ?? "N/A"}
      </div>
    ),
  },
  {
    accessorKey: "league",
    header: "League Name",
    cell: ({ row }) => {
      const leagueData = row.original.league;
      let leagueName = "N/A";
      if (
        typeof leagueData === "object" &&
        leagueData !== null &&
        "name" in leagueData
      ) {
        leagueName = (leagueData as League).name;
      } else if (typeof leagueData === "string") {
        const foundLeague = leagues.find((l) => l._id === leagueData);
        leagueName = foundLeague ? foundLeague.name : "ID: " + leagueData;
      }
      return <div className="capitalize">{leagueName}</div>;
    },
  },
  {
    accessorKey: "sport",
    header: "Sport name",
    cell: ({ row }) => {
      const sportData = row.original.sport;
      let sportName = "N/A";
      if (
        typeof sportData === "object" &&
        sportData !== null &&
        "name" in sportData
      ) {
        sportName = (sportData as Sport).name;
      } else if (typeof sportData === "string") {
        const foundSport = sports.find((s) => s._id === sportData);
        sportName = foundSport ? foundSport.name : "ID: " + sportData;
      }
      return <div className="capitalize">{sportName}</div>;
    },
  },
  {
    accessorKey: "startTime",
    header: "Start Time",
    // Định dạng lại thời gian nếu cần thiết, ví dụ:
    cell: ({ row }) => {
      const startTime = row.getValue("startTime") as string;
      return (
        <div className="capitalize">
          {new Date(startTime).toLocaleString("vi-VN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false,
          })}
        </div>
      ); // Ví dụ định dạng
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("status")}</div>
    ),
  },
  {
    accessorKey: "isHot",
    header: "Hot Match",
    cell: ({ row }) => {
      const sportData = row.original.sport;
      let sportName = "N/A";
      if (
        typeof sportData === "object" &&
        sportData !== null &&
        "name" in sportData
      ) {
        sportName = (sportData as Sport).name;
      }
      return (
        <div className="capitalize">
          {row.getValue("isHot") === true
            ? `Trận đấu tâm điểm/${sportName}`
            : `Trận đấu ${sportName}`}
        </div>
      );
    },
  },

  {
    id: "streamLabel",
    header: "Stream Label",
    accessorFn: (row) =>
      row.streamLinks?.map((link) => link.label).join(", ") || "N/A",
    cell: ({ getValue }) => (
      <div className="capitalize">{getValue() as string}</div>
    ),
  },
  {
    id: "commentator",
    header: "Commentator",
    accessorFn: (row) =>
      row.streamLinks?.map((link) => link.commentator).join(", ") || "N/A",
    cell: ({ getValue }) => (
      <div className="capitalize">{getValue() as string}</div>
    ),
  },

  {
    id: "commentatorImage",
    header: "Commentator Image",
    accessorFn: (row) =>
      row.streamLinks?.map((link) => link.commentatorImage).join(", ") || "N/A",
    cell: ({ getValue }) => {
      return getValue() ? (
        <img
          src={getValue() as string}
          alt="Team Logo"
          className="w-10 h-10 object-contain rounded-full" // Thay đổi kích thước và bo tròn nếu cần
        />
      ) : (
        "N/A"
      );
    },
  },
  {
    id: "streamUrl",
    header: "Stream URL",
    accessorFn: (row) =>
      row.streamLinks?.map((link) => link.url).join(", ") || "N/A",
    cell: ({ row }) => {
      const streamLinks = row.original.streamLinks;
      if (!streamLinks || streamLinks.length === 0) {
        return <div className="text-gray-500">N/A</div>;
      }
      return (
        <div className="flex flex-wrap gap-1">
          {streamLinks.map((link, index) => (
            <a
              key={index}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline break-all" // break-all để ngắt dòng URL dài
            >
              {link.label || link.url}
            </a>
          ))}
        </div>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    enableHiding: false,
    cell: ({ row }) => {
      const match = row.original;
      return (
        <div className="flex items-center gap-2">
          <Button
            onClick={() => onOpen("editMatch", { match })}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-[4px]"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            onClick={() => onOpen("deleteMatch", { match })}
            className="bg-red-500 hover:bg-red-700 text-white rounded-[4px]"
          >
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      );
    },
  },
];
