// TeamTable.tsx
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
import { apiGetAllTeams } from "@/services/team.services";
import { apiGetAllSports } from "@/services/sport.services"; // Import Sport API

import { Team } from "@/types/team.types"; // Import Team type
import { Sport } from "@/types/sport.types"; // Import Sport type

export function TeamTable() {
  const { onOpen } = useModal();
  const { team, setTeam } = useSelectedPageContext();
  const [sports, setSports] = React.useState<Sport[]>([]); // State để lưu danh sách sports

  // Chuyển onOpen và sports vào getColumns
  const columns = React.useMemo(
    () => getColumns(onOpen, sports),
    [onOpen, sports]
  );

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data: team,
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

  // Đổi tên hàm và thêm logic fetch sports
  const fetchTeamRelatedData = async () => {
    try {
      // 1. Fetch all sports and teams concurrently
      const [sportsRes, teamsRes] = await Promise.all([
        apiGetAllSports(),
        apiGetAllTeams(),
      ]);

      const allSports = sportsRes.data || [];
      const fetchedTeams = teamsRes.data || [];

      setSports(allSports); // Cập nhật state sports

      // 2. Populate sport field for each team if it's just an ID
      const populatedTeams: Team[] = fetchedTeams.map((t: Team) => {
        const populatedTeam = { ...t };

        // Populate sport
        if (typeof populatedTeam.sport === "string") {
          const foundSport = allSports.find(
            (s: Sport) => s._id === populatedTeam.sport
          );
          // Cần một object Sport đầy đủ cho fallback nếu không tìm thấy
          populatedTeam.sport = foundSport || {
            _id: populatedTeam.sport,
            name: "Unknown Sport",
            slug: "unknown-sport",
            icon: "",
          };
        }
        return populatedTeam;
      });
      setTeam(populatedTeams); // Cập nhật state team với dữ liệu đã populate
    } catch (error) {
      console.error("Error fetching team related data:", error);
      // Optional: Handle error state for the table (e.g., show a message)
    }
  };

  React.useEffect(() => {
    fetchTeamRelatedData();
  }, []); // Chạy một lần khi component mount

  return (
    <div className="w-full shadow-lg drop-shadow-lg bg-white rounded-lg">
      {" "}
      {/* Thêm bg-white rounded-lg vào đây */}
      <div className="flex items-center py-4 px-6 justify-between">
        {" "}
        {/* Thêm px-6 cho padding */}
        <Input
          placeholder="Tìm kiếm theo tên đội"
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <div className="flex items-center space-x-2">
          {" "}
          {/* Gộp Button và DropdownMenu vào một div */}
          <Button
            onClick={() => onOpen("createTeam")}
            className="bg-blue-500 hover:bg-blue-700 text-white rounded-[4px]"
          >
            Tạo đội
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
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="overflow-x-auto">
        {" "}
        {/* Đổi .rounded-md .border thành overflow-x-auto */}
        <Table className="table-auto w-full">
          {" "}
          {/* Đổi equal-widths thành table-auto w-full */}
          <TableHeader className="bg-gray-50 sticky top-0">
            {" "}
            {/* Thêm sticky top-0 và bg-gray-50 */}
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      className="px-4 py-2 text-left font-medium whitespace-nowrap" // Thêm padding, font-medium, whitespace-nowrap
                      style={{ width: header.column.columnDef.meta?.width }} // Giữ lại style width nếu cần
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="hover:bg-gray-100" // Thêm hover effect
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className="px-4 py-2 whitespace-nowrap" // Thêm padding và whitespace-nowrap
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
        {" "}
        {/* Thêm px-6 cho padding */}
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
