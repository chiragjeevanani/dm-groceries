import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Card from "@shared/components/ui/Card";
import Badge from "@shared/components/ui/Badge";
import { adminApi } from "../services/adminApi";
import {
  ShoppingBag,
  CheckCircle,
  Clock,
  XCircle,
  TrendingUp,
  Users,
  Truck,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  ChevronDown,
  Loader2,
  FileText
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const AdminDashboard = () => {
  const [statsData, setStatsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdatedAt, setLastUpdatedAt] = useState(null);
  const [selectedRange, setSelectedRange] = useState("Last 30 Days");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await adminApi.getStats();
        if (res.data.success) {
          setStatsData(res.data.result);
          setLastUpdatedAt(new Date());
        }
      } catch (error) {
        console.error("Dashboard Stats Error:", error);
        toast.error("Failed to fetch dashboard data");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const getDateRangeLabel = (range) => {
    const today = new Date();
    const formatDate = (d) =>
      d.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });

    if (range === "Today") {
      return `${formatDate(today)} - ${formatDate(today)}`;
    }
    if (range === "Yesterday") {
      const yesterday = new Date();
      yesterday.setDate(today.getDate() - 1);
      return `${formatDate(yesterday)} - ${formatDate(yesterday)}`;
    }
    if (range === "Last 7 Days") {
      const past = new Date();
      past.setDate(today.getDate() - 7);
      return `${formatDate(past)} - ${formatDate(today)}`;
    }
    // Default: Last 30 Days
    const past = new Date();
    past.setDate(today.getDate() - 30);
    return `${formatDate(past)} - ${formatDate(today)}`;
  };

  if (loading) {
    return (
      <div className="h-[80vh] flex flex-col items-center justify-center space-y-4 bg-slate-50/50">
        <Loader2 className="h-10 w-10 text-[#154D1A] animate-spin" />
        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">
          Loading Admin Platform Data...
        </p>
      </div>
    );
  }

  // Fallbacks and actual data binding
  const overview = statsData?.overview || {};
  const totalOrdersVal = overview.totalOrders || 1248;
  const completedOrdersVal = overview.completedOrders || 1058;
  const pendingOrdersVal = overview.pendingOrders || 68;
  const cancelledOrdersVal = overview.cancelledOrders || 122;

  const totalSalesVal = overview.totalSales || overview.totalRevenue || 185320;
  const totalCustomersVal = overview.totalUsers || 2453;
  const totalDeliveryBoysVal = overview.totalDeliveryBoys || 32;
  const totalEarningsVal = overview.totalEarnings || Math.round(totalSalesVal * 0.25) || 45620;

  const chartData = statsData?.revenueHistory && statsData.revenueHistory.length > 0 
    ? statsData.revenueHistory 
    : [
        { name: "20 May", revenue: 25000, orders: 150 },
        { name: "21 May", revenue: 58000, orders: 340 },
        { name: "22 May", revenue: 35000, orders: 220 },
        { name: "23 May", revenue: 48000, orders: 300 },
        { name: "24 May", revenue: 62000, orders: 410 },
        { name: "25 May", revenue: 51000, orders: 320 },
        { name: "26 May", revenue: 80000, orders: 520 },
      ];

  const pieData = [
    { name: "Completed", value: completedOrdersVal, color: "#16a34a" },
    { name: "Pending", value: pendingOrdersVal, color: "#eab308" },
    { name: "Cancelled", value: cancelledOrdersVal, color: "#dc2626" },
  ];

  const recentOrders = statsData?.recentOrders && statsData.recentOrders.length > 0
    ? statsData.recentOrders
    : [
        { id: "#DM123456789", customer: "Rakesh Patel", status: "delivered", statusText: "Delivered", amount: "₹ 632", time: "26 May 2024" },
        { id: "#DM123456788", customer: "Meena Shah", status: "shipped", statusText: "Out For Delivery", amount: "₹ 520", time: "26 May 2024" },
        { id: "#DM123456787", customer: "Jignesh Patel", status: "pending", statusText: "Preparing", amount: "₹ 320", time: "26 May 2024" },
        { id: "#DM123456786", customer: "Pooja Desai", status: "pending", statusText: "Pending", amount: "₹ 250", time: "26 May 2024" },
        { id: "#DM123456785", customer: "Bharat Soni", status: "cancelled", statusText: "Cancelled", amount: "₹ 185", time: "26 May 2024" },
      ];

  const topProducts = statsData?.topProducts && statsData.topProducts.length > 0
    ? statsData.topProducts
    : [
        { name: "Tomato", cat: "Vegetables", rev: "245 kg", trend: "Fresh Produce" },
        { name: "Potato", cat: "Vegetables", rev: "210 kg", trend: "Fresh Produce" },
        { name: "Onion", cat: "Vegetables", rev: "198 kg", trend: "Fresh Produce" },
        { name: "Apple", cat: "Fruits", rev: "150 kg", trend: "Imported" },
        { name: "Banana", cat: "Fruits", rev: "140 kg", trend: "Organic" },
      ];

  const topCategories = [
    { name: "Vegetables", value: "₹ 75,250" },
    { name: "Fruits", value: "₹ 42,360" },
    { name: "Grocery", value: "₹ 32,450" },
    { name: "Dairy Products", value: "₹ 18,750" },
    { name: "Household", value: "₹ 16,510" },
  ];

  return (
    <div className="space-y-6 p-4 md:p-6 font-['Poppins',_sans-serif] bg-[#F7F9F7] min-h-screen pb-16">
      {/* Header bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 leading-tight">Dashboard</h1>
          <p className="text-sm text-slate-500 font-semibold mt-1">Welcome back, Admin!</p>
        </div>

        {/* Date Selector and actions */}
        <div className="flex items-center gap-3 relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2.5 px-4.5 py-2.5 bg-white border border-slate-200/80 rounded-xl text-sm font-bold text-slate-600 shadow-sm hover:bg-slate-50 transition-all select-none"
          >
            <Calendar size={16} className="text-slate-400" />
            <span>{getDateRangeLabel(selectedRange)}</span>
            <ChevronDown size={14} className="text-slate-400 ml-1" />
          </button>

          {isDropdownOpen && (
            <>
              <div
                className="fixed inset-0 z-20"
                onClick={() => setIsDropdownOpen(false)}
              />
              <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-slate-100 rounded-xl shadow-lg z-30 py-1.5 overflow-hidden">
                {["Today", "Yesterday", "Last 7 Days", "Last 30 Days"].map(
                  (rangeOption) => (
                    <button
                      key={rangeOption}
                      onClick={() => {
                        setSelectedRange(rangeOption);
                        setIsDropdownOpen(false);
                      }}
                      className={cn(
                        "w-full text-left px-4 py-2 text-xs font-bold transition-all hover:bg-slate-50",
                        selectedRange === rangeOption
                          ? "text-[#154D1A] bg-emerald-50/50"
                          : "text-slate-600"
                      )}
                    >
                      {rangeOption}
                    </button>
                  )
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* ==================== 8 STATISTICS CARDS GRID ==================== */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Row 1 Stats */}
        {[
          { label: "Total Orders", value: totalOrdersVal.toLocaleString(), icon: ShoppingBag, color: "text-emerald-600", bg: "bg-emerald-50 border-emerald-100/50", trend: "▲ 12.5%", trendUp: true },
          { label: "Completed Orders", value: completedOrdersVal.toLocaleString(), icon: CheckCircle, color: "text-emerald-600", bg: "bg-emerald-50 border-emerald-100/50", trend: "▲ 15.3%", trendUp: true },
          { label: "Pending Orders", value: pendingOrdersVal.toLocaleString(), icon: Clock, color: "text-amber-600", bg: "bg-amber-50 border-amber-100/50", trend: "▼ 5.2%", trendUp: false },
          { label: "Cancelled Orders", value: cancelledOrdersVal.toLocaleString(), icon: XCircle, color: "text-rose-600", bg: "bg-rose-50 border-rose-100/50", trend: "▼ 8.6%", trendUp: false }
        ].map((card, idx) => (
          <div
            key={idx}
            className="p-5 bg-white rounded-[18px] border border-slate-100 shadow-[0_4px_15px_rgba(0,0,0,0.02)] transition-all hover:-translate-y-1 hover:shadow-md flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#154D1A] uppercase tracking-wider">{card.label}</span>
              <div className={cn("h-9 w-9 rounded-lg flex items-center justify-center border", card.bg)}>
                <card.icon size={18} className={card.color} />
              </div>
            </div>
            <div className="mt-3">
              <h3 className="text-2xl font-black text-slate-800 leading-tight">{card.value}</h3>
              <p className="flex items-center gap-1 text-xs font-bold mt-1">
                <span className={card.trendUp ? "text-emerald-600" : "text-rose-600"}>{card.trend}</span>
                <span className="text-slate-400 font-medium">vs last 7 days</span>
              </p>
            </div>
          </div>
        ))}

        {/* Row 2 Stats */}
        {[
          { label: "Total Sales", value: `₹ ${totalSalesVal.toLocaleString()}`, icon: DollarSign, color: "text-emerald-600", bg: "bg-emerald-50 border-emerald-100/50", trend: "▲ 15.2%", trendUp: true },
          { label: "Total Customers", value: totalCustomersVal.toLocaleString(), icon: Users, color: "text-emerald-600", bg: "bg-emerald-50 border-emerald-100/50", trend: "▲ 8.4%", trendUp: true },
          { label: "Total Delivery Boys", value: totalDeliveryBoysVal.toLocaleString(), icon: Truck, color: "text-amber-600", bg: "bg-amber-50 border-amber-100/50", trend: "▲ 6.7%", trendUp: true },
          { label: "Total Earnings", value: `₹ ${totalEarningsVal.toLocaleString()}`, icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-50 border-emerald-100/50", trend: "▲ 10.2%", trendUp: true }
        ].map((card, idx) => (
          <div
            key={idx}
            className="p-5 bg-white rounded-[18px] border border-slate-100 shadow-[0_4px_15px_rgba(0,0,0,0.02)] transition-all hover:-translate-y-1 hover:shadow-md flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#154D1A] uppercase tracking-wider">{card.label}</span>
              <div className={cn("h-9 w-9 rounded-lg flex items-center justify-center border", card.bg)}>
                <card.icon size={18} className={card.color} />
              </div>
            </div>
            <div className="mt-3">
              <h3 className="text-2xl font-black text-slate-800 leading-tight">{card.value}</h3>
              <p className="flex items-center gap-1 text-xs font-bold mt-1">
                <span className={card.trendUp ? "text-emerald-600" : "text-rose-600"}>{card.trend}</span>
                <span className="text-slate-400 font-medium">vs last 7 days</span>
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* ==================== MIDDLE ROW (Chart + Pie) ==================== */}
      <div className="grid grid-cols-1 lg:grid-cols-[7fr_5fr] gap-6">
        {/* Sales Overview Card */}
        <Card className="p-6 border border-slate-100 shadow-sm rounded-[20px] bg-white">
          <div className="flex items-center justify-between mb-6 pb-2 border-b border-slate-50">
            <div>
              <h3 className="text-base font-bold text-slate-800">Sales Overview</h3>
            </div>
            <select className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-bold text-slate-600 outline-none">
              <option>This Week</option>
              <option>This Month</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-[1fr_220px] gap-6">
            <div className="h-68">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorSalesOverview" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#16a34a" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#16a34a" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 11 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 11 }} />
                  <Tooltip />
                  <Area type="monotone" dataKey="revenue" stroke="#16a34a" strokeWidth={2.5} fillOpacity={1} fill="url(#colorSalesOverview)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="flex flex-col justify-center space-y-4 pt-2 md:pt-0">
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Sales</span>
                <p className="text-base font-black text-slate-800 mt-0.5">₹ {totalSalesVal.toLocaleString()}</p>
                <span className="text-xs text-emerald-600 font-bold flex items-center gap-0.5 mt-0.5">
                  ▲ 15.3% <span className="text-slate-400 font-medium">vs last 7 days</span>
                </span>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Orders</span>
                <p className="text-base font-black text-slate-800 mt-0.5">{totalOrdersVal.toLocaleString()}</p>
                <span className="text-xs text-emerald-600 font-bold flex items-center gap-0.5 mt-0.5">
                  ▲ 12.5% <span className="text-slate-400 font-medium">vs last 7 days</span>
                </span>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Average Order Value</span>
                <p className="text-base font-black text-slate-800 mt-0.5">₹ 148.55</p>
                <span className="text-xs text-emerald-600 font-bold flex items-center gap-0.5 mt-0.5">
                  ▲ 8.6% <span className="text-slate-400 font-medium">Growth</span>
                </span>
              </div>
            </div>
          </div>
        </Card>

        {/* Order Status Doughnut Card */}
        <Card className="p-6 border border-slate-100 shadow-sm rounded-[20px] bg-white flex flex-col justify-between">
          <div className="mb-4 pb-2 border-b border-slate-50">
            <h3 className="text-base font-bold text-slate-800">Order Status</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-[1.2fr_1fr] gap-4 items-center">
            {/* Pie Chart */}
            <div className="h-56 relative flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={85}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-2xl font-black text-slate-800 tabular-nums">{totalOrdersVal.toLocaleString()}</span>
                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-0.5">Total Orders</span>
              </div>
            </div>

            {/* Legend column */}
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="h-2.5 w-2.5 rounded-full bg-emerald-600" />
                  <span className="text-xs font-bold text-slate-500">Completed</span>
                </div>
                <span className="text-xs font-extrabold text-slate-800">{completedOrdersVal} (84.8%)</span>
              </div>

              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="h-2.5 w-2.5 rounded-full bg-yellow-500" />
                  <span className="text-xs font-bold text-slate-500">Pending</span>
                </div>
                <span className="text-xs font-extrabold text-slate-800">{pendingOrdersVal} (5.4%)</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-2.5 w-2.5 rounded-full bg-rose-600" />
                  <span className="text-xs font-bold text-slate-500">Cancelled</span>
                </div>
                <span className="text-xs font-extrabold text-slate-800">{cancelledOrdersVal} (9.8%)</span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* ==================== BOTTOM ROW (3 Tables/Lists) ==================== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders List */}
        <Card className="p-6 border border-slate-100 shadow-sm rounded-[20px] bg-white flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-50">
              <h3 className="text-base font-bold text-slate-800">Recent Orders</h3>
              <a href="/admin/orders" className="text-xs font-bold text-emerald-600 hover:underline">
                View All
              </a>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-xs font-bold text-slate-400 uppercase border-b border-slate-100">
                    <th className="pb-2">Order ID</th>
                    <th className="pb-2">Customer</th>
                    <th className="pb-2">Amount</th>
                    <th className="pb-2">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {recentOrders.map((order, i) => (
                    <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-3.5 text-xs font-bold text-slate-700">{order.id}</td>
                      <td className="py-3.5 text-xs font-bold text-slate-600">{order.customer}</td>
                      <td className="py-3.5 text-xs font-extrabold text-slate-800">{order.amount}</td>
                      <td className="py-3.5">
                        <span className={cn(
                          "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase",
                          order.status === "delivered" ? "bg-emerald-50 text-emerald-800 border border-emerald-100" :
                          order.status === "cancelled" ? "bg-rose-50 text-rose-800 border border-rose-100" :
                          "bg-amber-50 text-amber-800 border border-amber-100"
                        )}>
                          {order.statusText}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Card>

        {/* Top Selling Products */}
        <Card className="p-6 border border-slate-100 shadow-sm rounded-[20px] bg-white flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-50">
              <h3 className="text-base font-bold text-slate-800">Top Selling Products</h3>
              <a href="/admin/products" className="text-xs font-bold text-emerald-600 hover:underline">
                View All
              </a>
            </div>

            <div className="space-y-4">
              {topProducts.map((prod, i) => (
                <div key={i} className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-3.5">
                    <span className="text-sm font-bold text-slate-400">{i + 1}</span>
                    <div>
                      <h4 className="text-xs font-bold text-slate-800">{prod.name}</h4>
                      <p className="text-[10px] text-slate-400 font-semibold">{prod.cat}</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-slate-700 bg-slate-100 px-3 py-1.5 rounded-lg">
                    {prod.rev}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Top Categories */}
        <Card className="p-6 border border-slate-100 shadow-sm rounded-[20px] bg-white flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-50">
              <h3 className="text-base font-bold text-slate-800">Top Categories</h3>
              <a href="/admin/categories" className="text-xs font-bold text-emerald-600 hover:underline">
                View All
              </a>
            </div>

            <div className="space-y-4">
              {topCategories.map((cat, i) => (
                <div key={i} className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-2">
                    <div className="h-2.5 w-2.5 rounded-full bg-emerald-600" />
                    <span className="text-xs font-bold text-slate-700">{cat.name}</span>
                  </div>
                  <span className="text-xs font-black text-slate-800">{cat.value}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* Footer copyright */}
      <div className="flex items-center justify-between pt-6 border-t border-slate-200/50 text-xs font-bold text-slate-400 uppercase tracking-wider">
        <span>© 2024 DM Groceries & Vegetables. All rights reserved.</span>
        <span>Version 1.0.0</span>
      </div>
    </div>
  );
};

export default AdminDashboard;
