import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { TrendingUp, ArrowUpRight, Download } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import Button from "@/shared/components/ui/Button";
import Card from "@/shared/components/ui/Card";
import { deliveryApi } from "../services/deliveryApi";

const RUPEE = "\u20B9";
const DOT = "\u2022";
const resolveTipAmount = (txn) =>
  Number(
    txn?.meta?.tipAmount ??
      txn?.order?.paymentBreakdown?.riderTipAmount ??
      txn?.order?.pricing?.tip ??
      0,
  );

const EarningsPage = () => {
  const [activeTab, setActiveTab] = useState("weekly");
  const [loading, setLoading] = useState(true);
  const [earningsData, setEarningsData] = useState({
    totalEarnings: 0,
    incentives: 0,
    bonuses: 0,
    tipsReceived: 0,
    chartData: [],
    recentTransactions: [],
  });

  const fetchEarnings = async () => {
    try {
      setLoading(true);
      const response = await deliveryApi.getEarnings();
      if (response.data.success && response.data.result) {
        const result = response.data.result;
        setEarningsData({
          totalEarnings: result.totalEarnings || 0,
          incentives: result.incentives || 0,
          bonuses: result.bonuses || 0,
          tipsReceived: result.tipsReceived || 0,
          chartData: result.chartData || [],
          recentTransactions: result.transactions || result.recentTransactions || [],
        });
      }
    } catch {
      toast.error("Failed to fetch earnings data");
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchEarnings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50/50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  const maxVal = Math.max(...(earningsData.chartData || []).map(d => (d.earnings || 0) + (d.incentives || 0)), 0);

  return (
    <div className="bg-white min-h-screen pb-28 relative overflow-hidden font-sans">
      
      {/* Deep Green Header Banner */}
      <div className="bg-[#1A4516] text-white pt-4 pb-12 px-6 relative">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-lg font-black leading-tight tracking-tight">My Earnings</h1>
            <p className="text-[11px] text-white/70 font-medium mt-0.5">Track your commission & tips</p>
          </div>
          <button
            onClick={() => toast.success("Downloading earnings report...")}
            className="p-2.5 bg-white/10 hover:bg-white/20 border border-white/10 rounded-full transition-colors cursor-pointer"
            aria-label="Download Report"
          >
            <Download size={18} className="text-white" />
          </button>
        </div>
      </div>

      {/* Main Content Area overlapping with rounded corners */}
      <div className="bg-white rounded-t-[32px] -mt-5 pt-4 px-5 space-y-4 relative z-10">
        
        {/* Tabs */}
        <div className="flex bg-gray-100/80 p-1 rounded-xl">
          {["today", "weekly", "monthly"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all capitalize ${
                activeTab === tab
                  ? "bg-white text-[#1A4516] shadow-sm"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Total Earnings Card */}
        <motion.div variants={itemVariants} className="w-full">
          <div className="bg-gradient-to-br from-[#1A4516] to-[#123610] rounded-2xl p-3.5 text-white shadow-md shadow-[#1A4516]/10 relative overflow-hidden">
            {/* Background patterns */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -mr-6 -mt-6 blur-xl" />
            <div className="absolute bottom-0 left-0 w-20 h-20 bg-white/5 rounded-full -ml-6 -mb-6 blur-lg" />

            <p className="text-white/60 font-bold text-[9px] uppercase tracking-wider mb-0.5 relative z-10">
              Total Earnings
            </p>
            <div className="flex items-baseline mb-2 relative z-10">
              <span className="text-xl font-bold mr-0.5">{RUPEE}</span>
              <span className="text-3xl font-black tracking-tight">
                {Number(earningsData.totalEarnings || 0).toLocaleString()}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2.5 border-t border-white/10 relative z-10">
              <div>
                <p className="text-white/55 text-[9px] font-bold uppercase tracking-wide">Incentives</p>
                <p className="font-extrabold text-sm mt-0.5">
                  +{RUPEE}
                  {Number(earningsData.incentives || 0).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-white/55 text-[9px] font-bold uppercase tracking-wide">Tips</p>
                <p className="font-extrabold text-sm mt-0.5">
                  +{RUPEE}
                  {Number(earningsData.tipsReceived || 0).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Chart */}
        <motion.div variants={itemVariants}>
          <Card className="p-3.5 rounded-xl shadow-sm border border-gray-100 bg-white">
            <div className="flex justify-between items-center mb-2.5">
              <h3 className="font-bold text-gray-800 text-xs flex items-center">
                <TrendingUp size={16} className="mr-1.5 text-[#1A4516]" />
                Earnings Trend
              </h3>
              <Button variant="ghost" size="sm" className="h-6 text-[10px] px-2 text-gray-400 hover:text-gray-600">
                Last 7 Days
              </Button>
            </div>
            <div className="h-32 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={earningsData.chartData} barSize={16} margin={{ bottom: -5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                  <YAxis domain={[0, maxVal > 0 ? 'auto' : 1000]} hide={true} />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 9, fill: "#9ca3af" }}
                    dy={5}
                  />
                  <Tooltip
                    cursor={{ fill: "#fdfdfd" }}
                    contentStyle={{
                      borderRadius: "8px",
                      border: "none",
                      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
                      fontSize: "10px",
                    }}
                  />
                  <Bar dataKey="earnings" fill="#1A4516" radius={[3, 3, 0, 0]} stackId="a" />
                  <Bar dataKey="incentives" fill="#93c5fd" radius={[3, 3, 0, 0]} stackId="a" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </motion.div>

        {/* Recent Transactions */}
        <motion.div variants={itemVariants}>
          <Card className="overflow-hidden border border-gray-100 rounded-xl shadow-sm bg-white">
            <div className="p-3 px-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/40">
              <h3 className="font-bold text-gray-800 text-xs">Recent Earnings</h3>
              <Button variant="link" className="text-[#1A4516] text-[11px] font-bold h-auto p-0 hover:underline">
                View All
              </Button>
            </div>
            <div className="divide-y divide-gray-100">
              {Array.isArray(earningsData.recentTransactions) && earningsData.recentTransactions.length > 0 ? (
                earningsData.recentTransactions.map((txn, idx) => (
                  <div
                    key={txn._id || txn.id || `txn-${idx}`}
                    className="p-3 px-4 flex justify-between items-center hover:bg-gray-50/50 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center">
                      <div
                        className={`p-1.5 rounded-full mr-2.5 ${
                          txn.status === "Settled" || txn.status === "Completed"
                            ? "bg-emerald-50 text-emerald-600"
                            : "bg-yellow-50 text-yellow-600"
                        }`}
                      >
                        <ArrowUpRight size={14} />
                      </div>
                      <div>
                        <p className="font-bold text-xs text-gray-900">{txn.type}</p>
                        <p className="text-[10px] text-gray-400 mt-0.5">
                          {txn.date ||
                            new Date(txn.createdAt).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                            })}{" "}
                          {DOT}{" "}
                          {txn.id ||
                            (txn._id ? txn._id.toString().slice(-6).toUpperCase() : "N/A")}
                        </p>
                        {resolveTipAmount(txn) > 0 && (
                          <p className="text-[9px] font-bold text-pink-600 mt-0.5">
                            Includes tip: {RUPEE}{resolveTipAmount(txn).toLocaleString()}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-xs text-gray-900">
                        {String(txn.type || "").includes("Withdrawal") ? "-" : "+"}
                        {RUPEE}
                        {Number(txn.amount || 0).toLocaleString()}
                      </p>
                      <p
                        className={`text-[9px] font-bold ${
                          txn.status === "Settled" || txn.status === "Completed"
                            ? "text-emerald-600"
                            : "text-yellow-600"
                        }`}
                      >
                        {txn.status}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-gray-400 text-xs italic">
                  No recent earnings or withdrawals.
                </div>
              )}
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default EarningsPage;

