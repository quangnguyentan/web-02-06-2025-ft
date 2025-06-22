import { useSelectedPageContext } from "@/hooks/use-context";
import { UserTable } from "@/components/tables/users/user-table";
import { SportTable } from "@/components/tables/sport/sport-table";
import { LeagueTable } from "@/components/tables/league/league-table";
import { MatchTable } from "@/components/tables/match/match-table";
import { TeamTable } from "@/components/tables/team/team-table";
import { ReplayTable } from "@/components/tables/replay/replay-table";

const TableProvider = () => {
  const { selectedPage } = useSelectedPageContext();

  return (
    <>
      {selectedPage === "Người dùng" && <UserTable />}
      {selectedPage === "Môn thể thao" && <SportTable />}
      {selectedPage === "Giải đấu" && <LeagueTable />}
      {selectedPage === "Trận đấu" && <MatchTable />}
      {selectedPage === "Đội bóng" && <TeamTable />}
      {selectedPage === "Phát lại" && <ReplayTable />}
    </>
  );
};

export default TableProvider;
