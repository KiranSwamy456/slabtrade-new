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
import type { AdminOrder, OrderStatus } from "@/services/order.service";

const STATUS_BADGE_STYLES: Record<OrderStatus, string> = {
  Pending: "bg-amber-50 text-amber-700",
  Confirmed: "bg-blue-50 text-blue-700",
  Shipped: "bg-violet-50 text-violet-700",
  Delivered: "bg-emerald-50 text-emerald-700",
  Cancelled: "bg-red-50 text-red-700",
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

function OrderActionsCell({
  order,
  onAccept,
  onIgnore,
}: {
  order: AdminOrder;
  onAccept?: (order: AdminOrder) => void | Promise<void>;
  onIgnore?: (order: AdminOrder) => void | Promise<void>;
}) {
  const [confirmAction, setConfirmAction] = useState<
    "accept" | "reject" | null
  >(null);
  const [busy, setBusy] = useState(false);

  const isPending = order.status === "Pending";

  const handleConfirm = async () => {
    setBusy(true);

    try {
      if (confirmAction === "accept") {
        await onAccept?.(order);
      } else if (confirmAction === "reject") {
        await onIgnore?.(order);
      }
    } finally {
      setBusy(false);
      setConfirmAction(null);
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
          <DropdownMenuItem
            disabled={!isPending}
            className="text-xs"
            onClick={() => setConfirmAction("accept")}
          >
            <Check />
            Accept order
          </DropdownMenuItem>

          <DropdownMenuItem
            disabled={!isPending}
            variant="destructive"
            className="text-xs"
            onClick={() => setConfirmAction("reject")}
          >
            <X />
            Reject order
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog
        open={confirmAction !== null}
        onOpenChange={(open) => !open && !busy && setConfirmAction(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {confirmAction === "accept"
                ? "Accept this order?"
                : "Reject this order?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {confirmAction === "accept"
                ? `Are you sure you want to accept order ${order.orderNumber}? The customer and vendor will see it as confirmed.`
                : `Are you sure you want to reject order ${order.orderNumber}? This cancels the order.`}
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={busy}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(event) => {
                event.preventDefault();
                void handleConfirm();
              }}
              disabled={busy}
              className={cn(
                confirmAction === "reject" &&
                  "bg-red-600 text-white hover:bg-red-600/90",
              )}
            >
              {busy && <Loader2 className="size-3.5 animate-spin" />}
              Yes, {confirmAction === "accept" ? "accept" : "reject"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

interface OrdersDataTableProps {
  orders: AdminOrder[];
  onAccept?: (order: AdminOrder) => void | Promise<void>;
  onIgnore?: (order: AdminOrder) => void | Promise<void>;
}

export function OrdersDataTable({
  orders,
  onAccept,
  onIgnore,
}: OrdersDataTableProps) {
  const [sorting, setSorting] = useState<SortingState>([
    { id: "createdAt", desc: true },
  ]);
  const [globalFilter, setGlobalFilter] = useState("");

  const columns = useMemo<ColumnDef<AdminOrder>[]>(
    () => [
      {
        accessorKey: "orderNumber",
        header: ({ column }) => (
          <SortableHeader
            label="Order #"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          />
        ),
        cell: ({ getValue }) => (
          <span className="font-medium text-slate-900">
            {getValue<string>()}
          </span>
        ),
      },
      {
        id: "customer",
        accessorFn: (order) =>
          `${order.customer.firstName} ${order.customer.lastName ?? ""}`.trim(),
        header: ({ column }) => (
          <SortableHeader
            label="Customer"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          />
        ),
        cell: ({ row }) => {
          const { customer } = row.original;
          return (
            <div>
              <p className="font-medium text-slate-900">
                {customer.firstName} {customer.lastName}
              </p>
              <p className="text-xs text-slate-500">{customer.email}</p>
            </div>
          );
        },
      },
      {
        id: "items",
        accessorFn: (order) => order.items.length,
        header: "Items",
        cell: ({ row }) => {
          const { items } = row.original;
          return (
            <span className="text-slate-700">
              {items.map((item) => item.materialName).join(", ")}
            </span>
          );
        },
      },
      {
        accessorKey: "totalAmount",
        header: ({ column }) => (
          <SortableHeader
            label="Total"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          />
        ),
        cell: ({ getValue }) => (
          <span className="font-medium text-slate-900">
            ${getValue<number>().toFixed(2)}
          </span>
        ),
      },
      {
        accessorKey: "paymentMethod",
        header: "Payment",
        cell: ({ getValue }) => (
          <Badge variant="outline" className="text-slate-600">
            {getValue<string>()}
          </Badge>
        ),
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ getValue }) => {
          const status = getValue<OrderStatus>();
          return (
            <Badge
              variant="secondary"
              className={STATUS_BADGE_STYLES[status] ?? "bg-slate-100 text-slate-700"}
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
            label="Date"
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
          <OrderActionsCell
            order={row.original}
            onAccept={onAccept}
            onIgnore={onIgnore}
          />
        ),
      },
    ],
    [onAccept, onIgnore],
  );

  const table = useReactTable({
    data: orders,
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
      const order = row.original;

      return [
        order.orderNumber,
        order.customer.firstName,
        order.customer.lastName,
        order.customer.email,
        order.status,
        ...order.items.map((item) => item.materialName),
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
            placeholder="Search orders..."
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
                  No orders found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="mt-3 flex items-center justify-between">
        <p className="text-xs text-slate-500">
          {filteredCount} of {orders.length} order{orders.length === 1 ? "" : "s"}
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
