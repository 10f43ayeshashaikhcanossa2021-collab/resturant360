import { useEffect, useState } from "react";
import { getInventory } from "../services/api";

function Inventory() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const loadInventory = async () => {
      try {
        const data = await getInventory();
        setItems(data || []);
      } catch (error) {
        console.error("Inventory load failed:", error);
      }
    };

    loadInventory();
  }, []);

  return (
    <div style={{ padding: "24px", color: "var(--text-main)" }}>
      <h2>Stock & Inventory Management</h2>

      <div style={{ marginTop: "20px", background: "#111827", borderRadius: "12px", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead style={{ background: "#0f172a" }}>
            <tr>
              <th style={{ padding: "12px", textAlign: "left" }}>Item</th>
              <th style={{ padding: "12px", textAlign: "left" }}>Category</th>
              <th style={{ padding: "12px", textAlign: "left" }}>Stock</th>
              <th style={{ padding: "12px", textAlign: "left" }}>Reorder</th>
              <th style={{ padding: "12px", textAlign: "left" }}>Unit</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} style={{ borderTop: "1px solid #1f2937" }}>
                <td style={{ padding: "12px" }}>{item.item}</td>
                <td style={{ padding: "12px" }}>{item.category}</td>
                <td style={{ padding: "12px", color: item.stock <= item.reorderLevel ? "#fbbf24" : "#e5e7eb" }}>{item.stock}</td>
                <td style={{ padding: "12px" }}>{item.reorderLevel}</td>
                <td style={{ padding: "12px" }}>{item.unit}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Inventory;
