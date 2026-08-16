"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FiBox, FiCheckCircle, FiShoppingBag, FiDollarSign } from "react-icons/fi";
import { fetchAllProducts } from "@/lib/products";
import { fetchOrders } from "@/lib/orders";
import { formatPKR } from "@/lib/format";
import StatusBadge from "@/components/admin/StatusBadge";

export default function DashboardOverview() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const [p, o] = await Promise.all([fetchAllProducts(), fetchOrders()]);
        if (active) {
          setProducts(p);
          setOrders(o);
          setStatus("ready");
        }
      } catch (err) {
        console.error(err);
        if (active) setStatus("error");
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const available = products.filter((p) => !p.sold).length;
  const sold = products.filter((p) => p.sold).length;
  const pendingOrders = orders.filter((o) => o.status === "pending").length;
  const revenue = orders
    .filter((o) => o.status === "delivered")
    .reduce((sum, o) => sum + (o.total || 0), 0);

  const stats = [
    { label: "Total Products", value: products.length, icon: FiBox },
    { label: "In Stock", value: available, icon: FiCheckCircle },
    { label: "Total Orders", value: orders.length, icon: FiShoppingBag, sub: `${pendingOrders} pending` },
    { label: "Revenue (Delivered)", value: formatPKR(revenue), icon: FiDollarSign },
  ];

  return (
    <div>
      <h1 className="font-display uppercase text-3xl mb-8">Overview</h1>

      {status === "error" && (
        <p className="text-accent text-sm mb-6">
          Could not load dashboard data. Check your Supabase configuration.
        </p>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
        {stats.map((s) => (
          <div key={s.label} className="bg-paper border border-border p-6">
            <s.icon className="text-accent mb-4" size={22} />
            <p className="text-2xl font-display">{status === "loading" ? "—" : s.value}</p>
            <p className="text-xs text-ink/50 mt-1">{s.label}</p>
            {s.sub && <p className="text-[11px] text-accent mt-1">{s.sub}</p>}
          </div>
        ))}
      </div>

      <div className="bg-paper border border-border">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="font-display uppercase text-lg">Recent Orders</h2>
          <Link href="/admin/dashboard/orders" className="text-xs text-accent hover:underline">
            View All
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-ink/40 border-b border-border">
                <th className="p-4">Customer</th>
                <th className="p-4">Items</th>
                <th className="p-4">Total</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.slice(0, 6).map((o) => (
                <tr key={o.id} className="border-b border-border last:border-none">
                  <td className="p-4">{o.customer?.name || "—"}</td>
                  <td className="p-4">{o.items?.length || 0}</td>
                  <td className="p-4">{formatPKR(o.total)}</td>
                  <td className="p-4">
                    <StatusBadge status={o.status} />
                  </td>
                </tr>
              ))}
              {status === "ready" && orders.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-6 text-center text-ink/40">
                    No orders yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
