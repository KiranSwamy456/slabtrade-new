"use client";

import { type ReactNode, useMemo, useState } from "react";
import {
  type ColumnDef,
  type SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  Pencil,
  Power,
  PowerOff,
  Search,
} from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { UserListItem } from "@/services/user.service";

const ROLE_BADGE_STYLES: Record<string, string> = {
  Admin: "bg-rose-50 text-rose-700",
  Vendor: "bg-violet-50 text-violet-700",
  Support: "bg-amber-50 text-amber-700",
  Customer: "bg-blue-50 text-blue-700",
};

const PAGE_SIZE = 10;

function SortableHeader({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  return (
    <Button
      variant="ghost"
      size="sm"
      className="-ml-3 h-8 px-3"
      onClick={onClick}
    >
      {label}
      <ArrowUpDown className="ml-1.5 size-3.5" />
    </Button>
  );
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function getInitials(user: UserListItem) {
  return (
    ((user.firstName?.[0] ?? "") + (user.lastName?.[0] ?? "")).toUpperCase() ||
    "?"
  );
}

interface UsersDataTableProps {
  users: UserListItem[];
  headerActions?: ReactNode;
  onToggleStatus?: (user: UserListItem) => void;
  onEdit?: (user: UserListItem) => void;
}

export function UsersDataTable({
  users,
  headerActions,
  onToggleStatus,
  onEdit,
}: UsersDataTableProps) {
  const [sorting, setSorting] = useState<SortingState>([
    { id: "createdAt", desc: true },
  ]);
  const [globalFilter, setGlobalFilter] = useState("");

  const columns = useMemo<ColumnDef<UserListItem>[]>(
    () => [
      {
        id: "name",
        accessorFn: (user) =>
          `${user.firstName} ${user.lastName ?? ""}`.trim(),
        header: ({ column }) => (
          <SortableHeader
            label="Name"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          />
        ),
        cell: ({ row }) => {
          const user = row.original;
          return (
            <div className="flex items-center gap-2.5">
              <Avatar className="size-8">
                {user.profileImage && (
                  <AvatarImage src={user.profileImage} alt="" />
                )}
                <AvatarFallback className="bg-slate-200 text-xs font-semibold text-slate-700">
                  {getInitials(user)}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium text-slate-900">
                  {user.firstName} {user.lastName}
                </p>
                {user.fullName && (
                  <p className="text-xs text-slate-500">{user.fullName}</p>
                )}
              </div>
            </div>
          );
        },
      },
      {
        accessorKey: "email",
        header: ({ column }) => (
          <SortableHeader
            label="Email"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          />
        ),
        cell: ({ getValue }) => (
          <span className="text-slate-700">{getValue<string>()}</span>
        ),
      },
      {
        accessorKey: "phone",
        header: "Phone",
        cell: ({ getValue }) => (
          <span className="text-slate-500">{getValue<string>() || "—"}</span>
        ),
      },
      {
        id: "role",
        accessorFn: (user) => user.role?.name ?? "—",
        header: ({ column }) => (
          <SortableHeader
            label="Role"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          />
        ),
        cell: ({ getValue }) => {
          const role = getValue<string>();
          return (
            <Badge
              variant="secondary"
              className={ROLE_BADGE_STYLES[role] ?? "bg-slate-100 text-slate-700"}
            >
              {role}
            </Badge>
          );
        },
      },
      {
        accessorKey: "isActive",
        header: "Status",
        cell: ({ getValue }) => (
          <Badge
            variant="secondary"
            className={
              getValue<boolean>()
                ? "bg-emerald-50 text-emerald-700"
                : "bg-slate-100 text-slate-500"
            }
          >
            {getValue<boolean>() ? "Active" : "Inactive"}
          </Badge>
        ),
      },
      {
        accessorKey: "isVerified",
        header: "Verified",
        cell: ({ getValue }) => (
          <Badge
            variant="secondary"
            className={
              getValue<boolean>()
                ? "bg-emerald-50 text-emerald-700"
                : "bg-amber-50 text-amber-700"
            }
          >
            {getValue<boolean>() ? "Verified" : "Unverified"}
          </Badge>
        ),
      },
      {
        accessorKey: "createdAt",
        header: ({ column }) => (
          <SortableHeader
            label="Created"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          />
        ),
        cell: ({ getValue }) => (
          <span className="text-slate-500">
            {formatDate(getValue<string>())}
          </span>
        ),
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
          const user = row.original;

          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon-sm" className="ml-auto">
                  <MoreVertical className="size-4" />
                  <span className="sr-only">Open actions</span>
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEdit?.(user)}>
                  <Pencil />
                  Edit
                </DropdownMenuItem>

                <DropdownMenuItem onClick={() => onToggleStatus?.(user)}>
                  {user.isActive ? (
                    <>
                      <PowerOff />
                      Deactivate
                    </>
                  ) : (
                    <>
                      <Power />
                      Activate
                    </>
                  )}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ],
    [onToggleStatus, onEdit],
  );

  const table = useReactTable({
    data: users,
    columns,
    state: {
      sorting,
      globalFilter,
    },
    initialState: {
      pagination: {
        pageSize: PAGE_SIZE,
      },
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: (row, _columnId, filterValue) => {
      const search = String(filterValue).toLowerCase();
      const user = row.original;

      return [
        user.firstName,
        user.lastName,
        user.fullName,
        user.email,
        user.phone,
        user.role?.name,
      ]
        .filter(Boolean)
        .some((field) => String(field).toLowerCase().includes(search));
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const filteredCount = table.getFilteredRowModel().rows.length;
  const pageCount = table.getPageCount();
  const currentPage = table.getState().pagination.pageIndex + 1;

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-sm flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Search users..."
            value={globalFilter}
            onChange={(event) => setGlobalFilter(event.target.value)}
            className="h-9 pl-9"
          />
        </div>

        {headerActions}
      </div>

      <div className="rounded-lg border border-slate-200 bg-white">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-sm text-slate-500"
                >
                  No users found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-xs text-slate-500">
          {filteredCount} of {users.length} user{users.length === 1 ? "" : "s"}
        </p>

        {pageCount > 1 && (
          <div className="flex items-center gap-3">
            <p className="text-xs text-slate-500">
              Page {currentPage} of {pageCount}
            </p>

            <div className="flex gap-1.5">
              <Button
                variant="outline"
                size="icon-sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                <ChevronLeft className="size-4" />
              </Button>
              <Button
                variant="outline"
                size="icon-sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                <ChevronRight className="size-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
