import { useEffect, useState } from "react";
import { getCustomers } from "../services/api";

function Customers() {
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    const loadCustomers = async () => {
      try {
        const data = await getCustomers();
        setCustomers(data || []);
      } catch (error) {
        console.error("Customers load failed:", error);
      }
    };

    loadCustomers();
  }, []);

  return (
    <div style={{ padding: "24px", color: "var(--text-main)" }}>
      <h2>Loyalty & Customer Management</h2>

      <div style={{ marginTop: "20px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px" }}>
        {customers.map((customer) => (
          <div key={customer.id} style={{ background: "#111827", borderRadius: "12px", padding: "18px", border: "1px solid #1f2937" }}>
            <div style={{ fontSize: "20px", fontWeight: 700 }}>{customer.name}</div>
            <div style={{ color: "#9ca3af", marginTop: "8px" }}>{customer.loyalty} Member</div>
            <div style={{ marginTop: "12px" }}>Visits: {customer.visits}</div>
            <div style={{ marginTop: "4px" }}>Total Spent: ₹{customer.totalSpent.toLocaleString("en-IN")}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Customers;
