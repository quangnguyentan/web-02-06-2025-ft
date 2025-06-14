// MatchTable.tsx
import * as React from "react";
import {
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getColumns } from "./columns"; // Import getColumns
import { useModal } from "@/hooks/use-model-store";
import { useSelectedPageContext } from "@/hooks/use-context";
import { apiGetAllMatches } from "@/services/match.services";
import { apiGetAllLeagues } from "@/services/league.services"; // Import League API
import { apiGetAllTeams } from "@/services/team.services"; // Import Team API
import { apiGetAllSports } from "@/services/sport.services"; // Import Sport API

import { Match } from "@/types/match.types"; // Import Match type
import { League } from "@/types/league.types"; // Import League type
import { Team } from "@/types/team.types"; // Import Team type
import { Sport } from "@/types/sport.types"; // Import Sport type

export function MatchTable() {
  const { onOpen } = useModal();
  const { match, setMatch } = useSelectedPageContext();
  const [leagues, setLeagues] = React.useState<League[]>([]); // State để lưu danh sách leagues
  const [teams, setTeams] = React.useState<Team[]>([]); // State để lưu danh sách teams
  const [sports, setSports] = React.useState<Sport[]>([]); // State để lưu danh sách sports

  // Chuyển onOpen, leagues, teams, và sports vào getColumns
  const columns = React.useMemo(
    () => getColumns(onOpen, leagues, teams, sports),
    [onOpen, leagues, teams, sports]
  );

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data: match,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    initialState: {
      pagination: {
        pageSize: 5,
      },
    },
  });

  const fetchMatchRelatedData = async () => {
    try {
      // 1. Fetch all leagues, teams, and sports concurrently
      const [leaguesRes, teamsRes, sportsRes, matchesRes] = await Promise.all([
        apiGetAllLeagues(),
        apiGetAllTeams(),
        apiGetAllSports(),
        apiGetAllMatches(), // Fetch matches last, so other data is ready for populating
      ]);

      const allLeagues = leaguesRes.data || [];
      const allTeams = teamsRes.data || [];
      const allSports = sportsRes.data || [];
      const fetchedMatches = matchesRes.data || [];

      setLeagues(allLeagues);
      setTeams(allTeams);
      setSports(allSports);

      // 2. Populate league, team1, team2, and sport fields for each match if they are just IDs
      const populatedMatches: Match[] = fetchedMatches.map((m: Match) => {
        const populatedMatch = { ...m };

        // Populate league
        if (typeof populatedMatch.league === "string") {
          const foundLeague = allLeagues.find(
            (l: League) => l._id === populatedMatch.league
          );
          populatedMatch.league = foundLeague || {
            _id: populatedMatch.league,
            name: "Unknown League",
            slug: "unknown-league",
            logo: "",
          };
        }

        // Populate homeTeam
        if (typeof populatedMatch.homeTeam === "string") {
          const foundTeam = allTeams.find(
            (t: Team) => t._id === populatedMatch.homeTeam
          );
          populatedMatch.homeTeam = foundTeam || {
            _id: populatedMatch.homeTeam,
            name: "Unknown Team",
            slug: "unknown-team",
            logo: "",
          };
        }

        // Populate awayTeam
        if (typeof populatedMatch.awayTeam === "string") {
          const foundTeam = allTeams.find(
            (t: Team) => t._id === populatedMatch.awayTeam
          );
          populatedMatch.awayTeam = foundTeam || {
            _id: populatedMatch.awayTeam,
            name: "Unknown Team",
            slug: "unknown-team",
            logo: "",
          };
        }

        // Populate sport
        if (typeof populatedMatch.sport === "string") {
          const foundSport = allSports.find(
            (s: Sport) => s._id === populatedMatch.sport
          );
          populatedMatch.sport = foundSport || {
            _id: populatedMatch.sport,
            name: "Unknown Sport",
            slug: "unknown-sport",
            icon: "",
          };
        }

        return populatedMatch;
      });
      setMatch(populatedMatches); // Cập nhật state match với dữ liệu đã populate
    } catch (error) {
      console.error("Error fetching match related data:", error);
    }
  };

  React.useEffect(() => {
    fetchMatchRelatedData();
  }, []); // Chạy một lần khi component mount

  return (
    <div className="w-full shadow-lg drop-shadow-lg bg-white rounded-lg">
      <div className="flex items-center py-4 px-6 justify-between">
        <Input
          placeholder="Tìm kiếm theo tiêu đề trận đấu..."
          value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("title")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <div className="flex items-center space-x-2">
          <Button
            onClick={() => onOpen("createMatch")}
            className="bg-blue-500 hover:bg-blue-700 text-white rounded-[4px]"
          >
            Thêm trận đấu
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                Columns <ChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column, index) => (
                  <DropdownMenuCheckboxItem
                    key={index}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="overflow-x-auto">
        <Table className="table-auto w-full">
          <TableHeader className="bg-gray-50 sticky top-0">
            {table.getHeaderGroups().map((headerGroup, index) => (
              <TableRow key={index}>
                {headerGroup.headers.map((header, indexHeader) => (
                  <TableHead
                    key={indexHeader}
                    className="px-4 py-2 text-left font-medium whitespace-nowrap"
                    style={{ width: header.column.columnDef.meta?.width }}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row, index) => (
                <TableRow
                  key={index}
                  data-state={row.getIsSelected() && "selected"}
                  className="hover:bg-gray-100"
                >
                  {row.getVisibleCells().map((cell, indexCell) => (
                    <TableCell
                      key={indexCell}
                      className="px-4 py-2 whitespace-nowrap"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4 px-6">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
