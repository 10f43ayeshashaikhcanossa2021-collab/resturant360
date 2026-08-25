import { FaPrint, FaTimes } from "react-icons/fa";


function ReceiptModal({ isOpen, onClose, cartItems, total, orderType, table, paymentMethod, isKotOnly }) {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };
  const orderId = "ORD-" + Math.floor(100000 + Math.random() * 900000);
  const now = new Date().toLocaleString();

  return (
    <div className="modal-overlay">
      <div className="modal-content receipt-modal-content">
        <div className="modal-header">
          <h3>{isKotOnly ? "Kitchen Order Ticket (KOT)" : "Tax Invoice / Receipt"}</h3>
          <button className="close-modal-btn" onClick={onClose}>
            <FaTimes />
          </button>
        </div>


        <div className="receipt-paper" id="printable-receipt">
          <div className="receipt-header">
            <h2>Restaurant360</h2>
            <p>123 Gourmet Street, Foodville</p>
            <p>Tel: +91 98765 43210</p>
            <div className="receipt-divider">--------------------------------</div>
          </div>

          <div className="receipt-meta">
            <div><strong>Order #:</strong> {orderId}</div>
            <div><strong>Date:</strong> {now}</div>
            <div><strong>Type:</strong> {orderType} ({table})</div>
            <div><strong>Cashier:</strong> cashier1</div>
          </div>

          <div className="receipt-divider">--------------------------------</div>


          <table className="receipt-table">
            <thead>
              <tr>
                <th style={{ textAlign: "left" }}>Item</th>
                <th style={{ textAlign: "center" }}>Qty</th>
                <th style={{ textAlign: "right" }}>Amount</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item) => (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td style={{ textAlign: "center" }}>{item.qty}</td>
                  <td style={{ textAlign: "right" }}>₹{(item.price * item.qty).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="receipt-divider">--------------------------------</div>


          {!isKotOnly && (
            <div className="receipt-summary">
              <div className="summary-row">
                <span>Subtotal:</span>
                <span>₹{cartItems.reduce((acc, i) => acc + i.price * i.qty, 0).toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span>Taxes & Charges:</span>
                <span>₹{(total - cartItems.reduce((acc, i) => acc + i.price * i.qty, 0)).toFixed(2)}</span>
              </div>
              <div className="summary-row grand-total">
                <strong>GRAND TOTAL:</strong>
                <strong>₹{total.toFixed(2)}</strong>
              </div>
              <div className="summary-row">
                <span>Payment Mode:</span>
                <span>{paymentMethod}</span>
              </div>
            </div>
          )}

          <div className="receipt-footer">
            <p>{isKotOnly ? "*** KITCHEN COPY ***" : "Thank you for dining with us!"}</p>
            <p>Visit again soon</p>
          </div>
        </div>


        <div className="modal-actions">
          <button className="primary-red-btn print-btn" onClick={handlePrint}>
            <FaPrint /> Print Now
          </button>
          <button className="secondary-dark-btn" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default ReceiptModal;
