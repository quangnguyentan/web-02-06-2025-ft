// columns.ts

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Edit, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ModalData, ModalType } from "@/hooks/use-model-store";
import { League } from "@/types/league.types";
import { Sport } from "@/types/sport.types";

export const getColumns = (
  onOpen: (type: ModalType, data?: ModalData) => void,
  sports: Sport[] // <--- Thêm tham số sports ở đây
): ColumnDef<League>[] => [
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
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => <div className="capitalize">{row.getValue("name")}</div>,
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
    accessorKey: "sport",
    header: "Sport name",
    cell: ({ row }) => {
      const sportData = row.original.sport; // Lấy dữ liệu sport thô

      let sportName = "N/A";
      if (
        typeof sportData === "object" &&
        sportData !== null &&
        "name" in sportData
      ) {
        // Nếu là object và có thuộc tính 'name'
        sportName = (sportData as Sport).name;
      } else if (typeof sportData === "string") {
        // Nếu là string (ID), tìm tên từ mảng sports được truyền vào
        const foundSport = sports.find((s) => s._id === sportData);
        sportName = foundSport ? foundSport.name : "ID: " + sportData; // Fallback to ID if not found
      }

      return <div className="capitalize">{sportName}</div>;
    },
  },
  {
    accessorKey: "logo",
    header: "Logo",
    cell: ({ row }) => {
      const logoUrl = row.getValue("logo") as string;
      return logoUrl ? (
        <img src={logoUrl} alt="Logo" className="w-8 h-8 object-contain" />
      ) : (
        "N/A"
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    enableHiding: false,
    cell: ({ row }) => {
      const league = row.original;
      return (
        <div className="flex items-center gap-2">
          <Button
            onClick={() => onOpen("editLeague", { league })}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-[4px]"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            onClick={() => onOpen("deleteLeague", { league })}
            className="bg-red-500 hover:bg-red-700 text-white rounded-[4px]"
          >
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      );
    },
  },
];
