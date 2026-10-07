"use client";

import { useMemo, useState } from "react";
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
  Check,
  ChevronLeft,
  ChevronRight,
  Loader2,
  MoreVertical,
  Search,
  X,
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
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";
import type {
  AdminSlabListing,
  SlabApprovalStatus,
} from "@/services/slab.service";

const APPROVAL_BADGE_STYLES: Record<SlabApprovalStatus, string> = {
  Pending: "bg-amber-50 text-amber-700",
  Approved: "bg-emerald-50 text-emerald-700",
  Rejected: "bg-red-50 text-red-700",
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

function SlabActionsCell({
  listing,
  onApprove,
  onReject,
}: {
  listing: AdminSlabListing;
  onApprove?: (listing: AdminSlabListing, price: number) => void | Promise<void>;
  onReject?: (listing: AdminSlabListing) => void | Promise<void>;
}) {
  const [dialog, setDialog] = useState<"approve" | "reject" | null>(null);
  const [price, setPrice] = useState("");
  const [busy, setBusy] = useState(false);

  const openApprove = () => {
    setPrice(
      listing.customerPrice !== null
        ? String(listing.customerPrice)
        : String(listing.unitPrice),
    );
    setDialog("approve");
  };

  const parsedPrice = Number(price);
  const isValidPrice =
    price.trim() !== "" && Number.isFinite(parsedPrice) && parsedPrice > 0;

  const handleConfirm = async () => {
    setBusy(true);

    try {
      if (dialog === "approve" && isValidPrice) {
        await onApprove?.(listing, parsedPrice);
      } else if (dialog === "reject") {
        await onReject?.(listing);
      }
    } finally {
      setBusy(false);
      setDialog(null);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon-sm" className="ml-auto">
            <MoreVertical className="size-4" />
            <span className="sr-only">Open actions</span>
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end">
          <DropdownMenuItem className="text-xs" onClick={openApprove}>
            <Check />
            Approve
          </DropdownMenuItem>

          <DropdownMenuItem
            variant="destructive"
            className="text-xs"
            onClick={() => setDialog("reject")}
          >
            <X />
            Reject
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog
        open={dialog !== null}
        onOpenChange={(open) => !open && !busy && setDialog(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {dialog === "approve" ? "Approve this slab?" : "Reject this slab?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {dialog === "approve"
                ? `Set the price customers will see for "${listing.materialName}". The vendor's own price ($${listing.unitPrice.toFixed(2)}) stays private to them.`
                : `Are you sure you want to reject "${listing.materialName}"? It will stay hidden from customers.`}
            </AlertDialogDescription>
          </AlertDialogHeader>

          {dialog === "approve" && (
            <div className="flex flex-col gap-1.5 px-1">
              <Label htmlFor="customerPrice" className="text-xs text-slate-700">
                Customer price
              </Label>
              <div className="relative">
                <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-sm text-slate-400">
                  $
                </span>
                <Input
                  id="customerPrice"
                  type="number"
                  min="0.01"
                  step="0.01"
                  autoFocus
                  value={price}
                  onChange={(event) => setPrice(event.target.value)}
                  className="h-8 pl-6"
                />
              </div>
            </div>
          )}

          <AlertDialogFooter>
            <AlertDialogCancel disabled={busy}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(event) => {
                event.preventDefault();
                void handleConfirm();
              }}
              disabled={busy || (dialog === "approve" && !isValidPrice)}
              className={cn(
                dialog === "reject" &&
                  "bg-red-600 text-white hover:bg-red-600/90",
              )}
            >
              {busy && <Loader2 className="size-3.5 animate-spin" />}
              Yes, {dialog === "approve" ? "approve" : "reject"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

interface SlabsDataTableProps {
  listings: AdminSlabListing[];
  onApprove?: (listing: AdminSlabListing, price: number) => void | Promise<void>;
  onReject?: (listing: AdminSlabListing) => void | Promise<void>;
}

export function SlabsDataTable({
  listings,
  onApprove,
  onReject,
}: SlabsDataTableProps) {
  const [sorting, setSorting] = useState<SortingState>([
    { id: "createdAt", desc: true },
  ]);
  const [globalFilter, setGlobalFilter] = useState("");

  const columns = useMemo<ColumnDef<AdminSlabListing>[]>(
    () => [
      {
        accessorKey: "materialName",
        header: ({ column }) => (
          <SortableHeader
            label="Material"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          />
        ),
        cell: ({ row }) => {
          const listing = row.original;
          return (
            <div>
              <p className="font-medium text-slate-900">
                {listing.materialName}
              </p>
              <p className="text-[10px] text-slate-500">{listing.vendorName}</p>
            </div>
          );
        },
      },
      {
        accessorKey: "unitPrice",
        header: ({ column }) => (
          <SortableHeader
            label="Vendor price"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          />
        ),
        cell: ({ getValue }) => (
          <span className="text-slate-700">${getValue<number>().toFixed(2)}</span>
        ),
      },
      {
        accessorKey: "customerPrice",
        header: "Customer price",
        cell: ({ getValue }) => {
          const value = getValue<number | null>();
          return (
            <span className="font-medium text-slate-900">
              {value === null ? "—" : `$${value.toFixed(2)}`}
            </span>
          );
        },
      },
      {
        accessorKey: "approvalStatus",
        header: "Status",
        cell: ({ getValue }) => {
          const status = getValue<SlabApprovalStatus>();
          return (
            <Badge
              variant="secondary"
              className={APPROVAL_BADGE_STYLES[status] ?? "bg-slate-100 text-slate-700"}
            >
              {status}
            </Badge>
          );
        },
      },
      {
        accessorKey: "createdAt",
        header: ({ column }) => (
          <SortableHeader
            label="Listed"
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
        cell: ({ row }) => (
          <SlabActionsCell
            listing={row.original}
            onApprove={onApprove}
            onReject={onReject}
          />
        ),
      },
    ],
    [onApprove, onReject],
  );

  const table = useReactTable({
    data: listings,
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
      const listing = row.original;

      return [
        listing.materialName,
        listing.vendorName,
        listing.approvalStatus,
        listing.portOfLoading,
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
    <Card className="gap-0 border border-slate-200 p-4 shadow-sm ring-0">
      <div className="flex justify-end">
        <div className="relative w-full max-w-sm">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Search slabs..."
            value={globalFilter}
            onChange={(event) => setGlobalFilter(event.target.value)}
            className="h-9 pl-9"
          />
        </div>
      </div>

      <div className="mt-3 overflow-hidden rounded-lg border border-slate-200 bg-white">
        <Table className="text-xs">
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
                  No slabs found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="mt-3 flex items-center justify-between">
        <p className="text-xs text-slate-500">
          {filteredCount} of {listings.length} slab
          {listings.length === 1 ? "" : "s"}
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
    </Card>
  );
}
