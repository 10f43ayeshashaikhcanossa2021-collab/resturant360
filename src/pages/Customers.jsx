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
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { Users, Crown, TrendingUp, Wallet } from "lucide-react";
import { getCustomers } from "../services/api";

const COLORS = ["#f97316", "#3b82f6", "#a855f7", "#22c55e"];

function Customers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCustomers = async () => {
      try {
        const data = await getCustomers();

        const updatedCustomers = Array.isArray(data)
          ? data.map((customer, index) => {
              const names = [
                "Aarav Sharma",
                "Rohan Verma",
                "Ananya Patel",
              ];

              return {
                ...customer,
                name: names[index] || customer.name,
              };
            })
          : [];

        setCustomers(updatedCustomers);
      } catch (error) {
        console.error("Customers load failed:", error);
      } finally {
        setLoading(false);
      }
    };

    loadCustomers();
  }, []);

  const analytics = useMemo(() => {
    const totalCustomers = customers.length;

    const totalSpent = customers.reduce(
      (sum, customer) => sum + Number(customer.totalSpent || 0),
      0
    );

    const totalVisits = customers.reduce(
      (sum, customer) => sum + Number(customer.visits || 0),
      0
    );

    const averageSpend =
      totalCustomers > 0 ? totalSpent / totalCustomers : 0;

    const loyaltyMap = {};

    customers.forEach((customer) => {
      const tier = customer.loyalty || "Unknown";
      loyaltyMap[tier] = (loyaltyMap[tier] || 0) + 1;
    });

    const loyaltyData = Object.entries(loyaltyMap).map(
      ([name, value]) => ({
        name,
        value,
      })
    );

    const spendingData = [...customers]
      .sort(
        (a, b) =>
          Number(b.totalSpent || 0) - Number(a.totalSpent || 0)
      )
      .map((customer) => ({
        name: customer.name?.split(" ")[0] || "Customer",
        spending: Number(customer.totalSpent || 0),
        visits: Number(customer.visits || 0),
      }));

    return {
      totalCustomers,
      totalSpent,
      totalVisits,
      averageSpend,
      loyaltyData,
      spendingData,
    };
  }, [customers]);

  if (loading) {
    return (
      <div className="analytics-page">
        <div className="analytics-loading">
          Loading customer analytics...
        </div>
      </div>
    );
  }

  return (
    <div className="analytics-page">
      <div className="analytics-header">
        <div>
          <h1>Loyalty & Customer Management</h1>
          <p>
            Understand customer loyalty, spending behaviour and visit
            frequency.
          </p>
        </div>
      </div>

      {/* KPI CARDS */}
      <div className="analytics-kpis">
        <div className="analytics-kpi-card">
          <div className="analytics-icon">
            <Users size={22} />
          </div>
          <div>
            <span>Total Customers</span>
            <strong>{analytics.totalCustomers}</strong>
          </div>
        </div>

        <div className="analytics-kpi-card">
          <div className="analytics-icon">
            <Wallet size={22} />
          </div>
          <div>
            <span>Total Customer Spend</span>
            <strong>
              ₹{analytics.totalSpent.toLocaleString("en-IN")}
            </strong>
          </div>
        </div>

        <div className="analytics-kpi-card">
          <div className="analytics-icon">
            <TrendingUp size={22} />
          </div>
          <div>
            <span>Average Spend</span>
            <strong>
              ₹{Math.round(analytics.averageSpend).toLocaleString("en-IN")}
            </strong>
          </div>
        </div>

        <div className="analytics-kpi-card">
          <div className="analytics-icon">
            <Crown size={22} />
          </div>
          <div>
            <span>Total Visits</span>
            <strong>{analytics.totalVisits}</strong>
          </div>
        </div>
      </div>

      {/* CHARTS */}
      <div className="analytics-grid">
        {/* LOYALTY PIE */}
        <section className="analytics-panel">
          <div className="panel-heading">
            <div>
              <h2>Loyalty Tier Distribution</h2>
              <p>Customer distribution by loyalty level</p>
            </div>
          </div>

          <div className="chart-container">
            {analytics.loyaltyData.length > 0 ? (
              <ResponsiveContainer width="100%" height={320}>
                <PieChart>
                  <Pie
                    data={analytics.loyaltyData}
                    cx="50%"
                    cy="50%"
                    innerRadius={75}
                    outerRadius={115}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {analytics.loyaltyData.map((entry, index) => (
                      <Cell
                        key={`cell-${entry.name}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>

                  <Tooltip
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
            ) : (
              <div className="empty-chart">
                No customer data available
              </div>
            )}
          </div>
        </section>

        {/* SPENDING BAR */}
        <section className="analytics-panel">
          <div className="panel-heading">
            <div>
              <h2>Customer Spending</h2>
              <p>Total spending by customer</p>
            </div>
          </div>

          <div className="chart-container">
            {analytics.spendingData.length > 0 ? (
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={analytics.spendingData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#273244"
                  />

                  <XAxis
                    dataKey="name"
                    stroke="#94a3b8"
                  />

                  <YAxis stroke="#94a3b8" />

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
                    dataKey="spending"
                    fill="#f97316"
                    radius={[8, 8, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="empty-chart">
                No spending data available
              </div>
            )}
          </div>
        </section>
      </div>

      {/* CUSTOMER CARDS */}
      <section className="customer-section">
        <div className="panel-heading">
          <div>
            <h2>Customer Loyalty Profiles</h2>
            <p>Detailed customer activity</p>
          </div>
        </div>

        <div className="customer-grid">
          {customers.map((customer) => (
            <div className="customer-card" key={customer.id}>
              <div className="customer-avatar">
                {customer.name?.charAt(0)?.toUpperCase()}
              </div>

              <div className="customer-info">
                <h3>{customer.name}</h3>

                <span className="loyalty-badge">
                  {customer.loyalty}
                </span>

                <div className="customer-stat">
                  <span>Visits</span>
                  <strong>{customer.visits}</strong>
                </div>

                <div className="customer-stat">
                  <span>Total Spent</span>
                  <strong>
                    ₹
                    {Number(customer.totalSpent || 0).toLocaleString(
                      "en-IN"
                    )}
                  </strong>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Customers;