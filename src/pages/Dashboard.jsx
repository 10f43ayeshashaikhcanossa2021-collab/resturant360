import { useEffect, useState } from "react";
import { getDashboardSummary, getOrders, getReports } from "../services/api";

function Dashboard() {
  const [summary, setSummary] = useState({
    revenue: 0,
    orders: 0,
    avgTicket: 0,
    occupancy: 0,
    topSelling: []
  });
  const [orders, setOrders] = useState([]);
  const [report, setReport] = useState({
    todaySales: 0,
    weeklySales: 0,
    growth: 0,
    topCategory: "-"
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const [dashboard, orderList, sales] = await Promise.all([
          getDashboardSummary(),
          getOrders(),
          getReports()
        ]);

        setSummary(dashboard || summary);
        setOrders(orderList || []);
        setReport(sales || report);
      } catch (error) {
        console.error("Dashboard load failed:", error);
      }
    };

    loadData();
  }, []);

  const cards = [
    { label: "Revenue", value: `₹${summary.revenue.toLocaleString("en-IN")}` },
    { label: "Orders", value: summary.orders },
    { label: "Avg Ticket", value: `₹${summary.avgTicket}` },
    { label: "Occupancy", value: `${summary.occupancy}%` }
  ];

  return (
    <div style={{ padding: "24px", color: "var(--text-main)" }}>
      <h2>Overview Dashboard</h2>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "16px", marginTop: "20px" }}>
        {cards.map((card) => (
          <div key={card.label} style={{ background: "#111827", borderRadius: "12px", padding: "18px", border: "1px solid #1f2937" }}>
            <div style={{ color: "#9ca3af", fontSize: "12px", textTransform: "uppercase" }}>{card.label}</div>
            <div style={{ marginTop: "8px", fontSize: "28px", fontWeight: 700 }}>{card.value}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: "20px", marginTop: "24px" }}>
        <div style={{ background: "#111827", padding: "18px", borderRadius: "12px" }}>
          <h3 style={{ marginBottom: "12px" }}>Recent Orders</h3>
          {orders.slice(0, 5).map((order) => (
            <div key={order.id} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid #1f2937" }}>
              <span>{order.id}</span>
              <span>{order.table}</span>
              <span>{order.status}</span>
              <span>₹{order.total}</span>
            </div>
          ))}
        </div>

        <div style={{ background: "#111827", padding: "18px", borderRadius: "12px" }}>
          <h3 style={{ marginBottom: "12px" }}>Sales Snapshot</h3>
          <p>Today: ₹{report.todaySales?.toLocaleString("en-IN")}</p>
          <p>This week: ₹{report.weeklySales?.toLocaleString("en-IN")}</p>
          <p>Growth: {report.growth}%</p>
          <p>Top category: {report.topCategory}</p>
          <p>Trending: {summary.topSelling.join(", ") || "-"}</p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
