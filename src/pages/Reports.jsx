import { useEffect, useState } from "react";
import { getReports } from "../services/api";

function Reports() {
  const [report, setReport] = useState({
    todaySales: 0,
    weeklySales: 0,
    topCategory: "-",
    growth: 0,
    month: "-"
  });

  useEffect(() => {
    const loadReports = async () => {
      try {
        const data = await getReports();
        setReport(data || report);
      } catch (error) {
        console.error("Reports load failed:", error);
      }
    };

    loadReports();
  }, []);

  return (
    <div style={{ padding: "24px", color: "var(--text-main)" }}>
      <h2>Analytics & Sales Reports</h2>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px", marginTop: "20px" }}>
        <div style={{ background: "#111827", borderRadius: "12px", padding: "18px" }}>
          <div style={{ color: "#9ca3af", fontSize: "12px" }}>Today Sales</div>
          <div style={{ fontSize: "28px", fontWeight: 700, marginTop: "8px" }}>₹{report.todaySales.toLocaleString("en-IN")}</div>
        </div>
        <div style={{ background: "#111827", borderRadius: "12px", padding: "18px" }}>
          <div style={{ color: "#9ca3af", fontSize: "12px" }}>Weekly Sales</div>
          <div style={{ fontSize: "28px", fontWeight: 700, marginTop: "8px" }}>₹{report.weeklySales.toLocaleString("en-IN")}</div>
        </div>
        <div style={{ background: "#111827", borderRadius: "12px", padding: "18px" }}>
          <div style={{ color: "#9ca3af", fontSize: "12px" }}>Growth</div>
          <div style={{ fontSize: "28px", fontWeight: 700, marginTop: "8px" }}>{report.growth}%</div>
        </div>
      </div>

      <div style={{ marginTop: "24px", background: "#111827", borderRadius: "12px", padding: "18px" }}>
        <p><strong>Month:</strong> {report.month}</p>
        <p><strong>Top Category:</strong> {report.topCategory}</p>
      </div>
    </div>
  );
}

export default Reports;
