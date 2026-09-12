import { useEffect, useMemo, useState } from "react";
import "../styles/analytics.css";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import {
  IndianRupee,
  TrendingUp,
  ShoppingCart,
  Target,
  Award,
} from "lucide-react";
import { getReports } from "../services/api";

const COLORS = [
  "#f97316",
  "#3b82f6",
  "#22c55e",
  "#a855f7",
];

function Reports() {
  const [report, setReport] = useState({
    todaySales: 0,
    weeklySales: 0,
    topCategory: "-",
    growth: 0,
    month: "-",
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadReports = async () => {
      try {
        const data = await getReports();

        if (data) {
          setReport((previous) => ({
            ...previous,
            ...data,
          }));
        }
      } catch (error) {
        console.error("Reports load failed:", error);
      } finally {
        setLoading(false);
      }
    };

    loadReports();
  }, []);

  const analytics = useMemo(() => {
    const dailyAverage =
      Number(report.weeklySales || 0) / 7;

    const estimatedMonthlySales =
      dailyAverage * 30;

    const categoryData = [
      {
        name: report.topCategory || "Main Course",
        value: Number(report.weeklySales || 0),
      },
      {
        name: "Other Categories",
        value: Math.max(
          Number(report.weeklySales || 0) * 0.35,
          1
        ),
      },
    ];

    const salesTrend = [
      {
        name: "Today",
        sales: Number(report.todaySales || 0),
      },
      {
        name: "Avg Day",
        sales: Math.round(dailyAverage),
      },
      {
        name: "Projected",
        sales: Math.round(estimatedMonthlySales),
      },
    ];

    const performanceData = [
      {
        name: "Today",
        value: Number(report.todaySales || 0),
      },
      {
        name: "Weekly",
        value: Number(report.weeklySales || 0),
      },
    ];

    return {
      dailyAverage,
      estimatedMonthlySales,
      categoryData,
      salesTrend,
      performanceData,
    };
  }, [report]);

  if (loading) {
    return (
      <div className="analytics-page">
        <div className="analytics-loading">
          Loading analytics...
        </div>
      </div>
    );
  }

  return (
    <div className="analytics-page">
      {/* HEADER */}
      <div className="analytics-header">
        <div>
          <h1>Analytics & Sales Reports</h1>
          <p>
            Monitor revenue, sales performance and business growth.
          </p>
        </div>

        <div className="report-period">
          {report.month}
        </div>
      </div>

      {/* KPI CARDS */}
      <div className="analytics-kpis">
        <div className="analytics-kpi-card">
          <div className="analytics-icon">
            <IndianRupee size={22} />
          </div>

          <div>
            <span>Today's Sales</span>
            <strong>
              ₹{Number(report.todaySales).toLocaleString("en-IN")}
            </strong>
          </div>
        </div>

        <div className="analytics-kpi-card">
          <div className="analytics-icon">
            <ShoppingCart size={22} />
          </div>

          <div>
            <span>Weekly Sales</span>
            <strong>
              ₹{Number(report.weeklySales).toLocaleString("en-IN")}
            </strong>
          </div>
        </div>

        <div className="analytics-kpi-card">
          <div className="analytics-icon">
            <TrendingUp size={22} />
          </div>

          <div>
            <span>Growth</span>
            <strong>{report.growth}%</strong>
          </div>
        </div>

        <div className="analytics-kpi-card">
          <div className="analytics-icon">
            <Award size={22} />
          </div>

          <div>
            <span>Top Category</span>
            <strong>{report.topCategory}</strong>
          </div>
        </div>
      </div>

      {/* MAIN CHART GRID */}
      <div className="analytics-grid">
        {/* SALES PIE */}
        <section className="analytics-panel">
          <div className="panel-heading">
            <div>
              <h2>Sales Distribution</h2>
              <p>Current sales contribution</p>
            </div>
          </div>

          <div className="chart-container">
            <ResponsiveContainer width="100%" height={320}>
              <PieChart>
                <Pie
                  data={analytics.categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={75}
                  outerRadius={115}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {analytics.categoryData.map((entry, index) => (
                    <Cell
                      key={`cell-${entry.name}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>

                <Tooltip
                  formatter={(value) =>
                    `₹${Number(value).toLocaleString("en-IN")}`
                  }
                  contentStyle={{
                    background: "#111827",
                    border: "1px solid #374151",
                    borderRadius: "10px",
                    color: "#fff",
                  }}
                />

                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* SALES TREND */}
        <section className="analytics-panel">
          <div className="panel-heading">
            <div>
              <h2>Revenue Performance</h2>
              <p>Sales performance overview</p>
            </div>
          </div>

          <div className="chart-container">
            <ResponsiveContainer width="100%" height={320}>
              <LineChart data={analytics.salesTrend}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#273244"
                />

                <XAxis
                  dataKey="name"
                  stroke="#94a3b8"
                />

                <YAxis
                  stroke="#94a3b8"
                />

                <Tooltip
                  formatter={(value) =>
                    `₹${Number(value).toLocaleString("en-IN")}`
                  }
                  contentStyle={{
                    background: "#111827",
                    border: "1px solid #374151",
                    borderRadius: "10px",
                    color: "#fff",
                  }}
                />

                <Line
                  type="monotone"
                  dataKey="sales"
                  stroke="#f97316"
                  strokeWidth={4}
                  dot={{
                    r: 5,
                    fill: "#f97316",
                  }}
                  activeDot={{
                    r: 7,
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>

      {/* CATEGORY + PERFORMANCE */}
      <div className="analytics-grid">
        <section className="analytics-panel">
          <div className="panel-heading">
            <div>
              <h2>Sales Comparison</h2>
              <p>Today vs weekly performance</p>
            </div>
          </div>

          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analytics.performanceData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#273244"
                />

                <XAxis
                  dataKey="name"
                  stroke="#94a3b8"
                />

                <YAxis
                  stroke="#94a3b8"
                />

                <Tooltip
                  formatter={(value) =>
                    `₹${Number(value).toLocaleString("en-IN")}`
                  }
                  contentStyle={{
                    background: "#111827",
                    border: "1px solid #374151",
                    borderRadius: "10px",
                    color: "#fff",
                  }}
                />

                <Bar
                  dataKey="value"
                  fill="#3b82f6"
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="analytics-panel insights-panel">
          <div className="panel-heading">
            <div>
              <h2>Business Insights</h2>
              <p>Quick performance indicators</p>
            </div>
          </div>

          <div className="insight-list">
            <div className="insight-item">
              <Target size={22} />
              <div>
                <span>Top Performing Category</span>
                <strong>{report.topCategory}</strong>
              </div>
            </div>

            <div className="insight-item">
              <TrendingUp size={22} />
              <div>
                <span>Growth Rate</span>
                <strong>{report.growth}%</strong>
              </div>
            </div>

            <div className="insight-item">
              <IndianRupee size={22} />
              <div>
                <span>Average Daily Sales</span>
                <strong>
                  ₹{Math.round(
                    analytics.dailyAverage
                  ).toLocaleString("en-IN")}
                </strong>
              </div>
            </div>

            <div className="insight-item">
              <Award size={22} />
              <div>
                <span>Projected Monthly Sales</span>
                <strong>
                  ₹{Math.round(
                    analytics.estimatedMonthlySales
                  ).toLocaleString("en-IN")}
                </strong>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Reports;