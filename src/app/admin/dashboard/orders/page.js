"use client";

import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { FiSearch, FiChevronDown, FiChevronUp } from "react-icons/fi";
import { fetchOrders, updateOrderStatus } from "@/lib/orders";
import { formatPKR } from "@/lib/format";

const STATUSES = ["pending", "confirmed", "shipped", "delivered", "cancelled"];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [status, setStatus] = useState("loading");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const items = await fetchOrders();
        setOrders(items);
        setStatus("ready");
      } catch (err) {
        console.error(err);
        setStatus("error");
      }
    })();
  }, []);

  const handleStatusChange = async (order, newStatus) => {
    try {
      await updateOrderStatus(order.id, newStatus);
      setOrders((list) => list.map((o) => (o.id === order.id ? { ...o, status: newStatus } : o)));
      toast.success("Order status updated");
    } catch (err) {
      console.error(err);
      toast.error("Could not update order");
    }
  };

  const filtered = useMemo(() => {
    return orders.filter((o) => {
      const matchesStatus = statusFilter === "All" || o.status === statusFilter;
      const q = search.toLowerCase();
      const matchesSearch =
        !q ||
        o.customer?.name?.toLowerCase().includes(q) ||
        o.customer?.phone?.includes(q);
      return matchesStatus && matchesSearch;
    });
  }, [orders, statusFilter, search]);

  return (
    <div>
      <h1 className="font-display uppercase text-3xl mb-8">Orders ({orders.length})</h1>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative max-w-sm flex-1">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/40" size={16} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or phone..."
            className="w-full pl-9 pr-4 py-2.5 bg-paper border border-border text-sm focus:outline-none focus:border-ink"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2.5 bg-paper border border-border text-sm focus:outline-none focus:border-ink"
        >
          <option value="All">All Statuses</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      <div className="bg-paper border border-border divide-y divide-border">
        {status === "loading" &&
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="p-4">
              <div className="h-10 bg-muted animate-pulse" />
            </div>
          ))}

        {status === "ready" && filtered.length === 0 && (
          <p className="p-8 text-center text-ink/40">No orders found.</p>
        )}

        {status === "ready" &&
          filtered.map((order) => (
            <div key={order.id}>
              <button
                onClick={() => setExpanded(expanded === order.id ? null : order.id)}
                className="w-full flex flex-wrap items-center gap-4 p-4 text-left cursor-pointer hover:bg-bg transition-colors"
              >
                <div className="flex-1 min-w-[140px]">
                  <p className="font-medium text-sm">{order.customer?.name}</p>
                  <p className="text-xs text-ink/50">{order.customer?.phone}</p>
                </div>
                <div className="text-xs text-ink/50 min-w-[100px]">{order.customer?.city}</div>
                <div className="text-sm font-semibold min-w-[100px]">{formatPKR(order.total)}</div>
                <div className="min-w-[130px]" onClick={(e) => e.stopPropagation()}>
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order, e.target.value)}
                    className="text-xs uppercase tracking-wide px-2 py-1.5 border border-border bg-paper cursor-pointer"
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                {expanded === order.id ? <FiChevronUp /> : <FiChevronDown />}
              </button>

              {expanded === order.id && (
                <div className="px-4 pb-6 bg-bg">
                  <div className="grid sm:grid-cols-2 gap-6 mb-4 text-sm">
                    <div>
                      <p className="text-xs uppercase text-ink/40 mb-1">Delivery Address</p>
                      <p className="text-ink/70">{order.customer?.address}, {order.customer?.city}</p>
                      {order.customer?.notes && (
                        <p className="text-ink/50 text-xs mt-1">Note: {order.customer.notes}</p>
                      )}
                    </div>
                    <div>
                      <p className="text-xs uppercase text-ink/40 mb-1">Payment</p>
                      <p className="text-ink/70">{order.paymentMethod}</p>
                    </div>
                  </div>
                  <ul className="divide-y divide-border border-t border-border">
                    {order.items?.map((item, i) => (
                      <li key={i} className="flex justify-between py-3 text-sm">
                        <span className="text-ink/70">
                          {item.name} — Size {item.size} × {item.qty}
                        </span>
                        <span>{formatPKR(item.price * item.qty)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
      </div>
    </div>
  );
}
