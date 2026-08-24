import { useState } from "react";
import { FaTimes, FaUsers } from "react-icons/fa";


function SplitBillModal({ isOpen, onClose, total, cartItems }) {
  const [splitType, setSplitType] = useState("people");
  const [peopleCount, setPeopleCount] = useState(2);

  if (!isOpen) return null;
  const perPersonAmount = (total / Math.max(1, peopleCount)).toFixed(2);

  return (
    <div className="modal-overlay">
      <div className="modal-content">

        <div className="modal-header">
          <h3><FaUsers /> Split Bill Calculator</h3>
          <button className="close-modal-btn" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <div className="modal-body">

          <div className="split-type-toggle">
            <button
              className={splitType === "people" ? "active" : ""}
              onClick={() => setSplitType("people")}
            >
              Split Equally
            </button>
            <button
              className={splitType === "items" ? "active" : ""}
              onClick={() => setSplitType("items")}
            >
              Split By Item
            </button>
          </div>

          {splitType === "people" ? (
            <div className="split-people-section">
              <div className="form-group">
                <label>Number of People:</label>
                <div className="qty-control-large">
                  <button onClick={() => setPeopleCount(Math.max(1, peopleCount - 1))}>-</button>
                  <span>{peopleCount}</span>
                  <button onClick={() => setPeopleCount(peopleCount + 1)}>+</button>
                </div>
              </div>


              <div className="split-result-box">
                <span className="result-label">Amount Per Person:</span>
                <span className="result-value">₹{perPersonAmount}</span>
              </div>
            </div>
          ) : (
            <div className="split-items-list">
              <p className="hint-text">Select items to assign to Guest 1 / Guest 2:</p>
              {cartItems.map((item) => (
                <div key={item.id} className="split-item-row">
                  <span>{item.name} (x{item.qty})</span>
                  <span>₹{(item.price * item.qty).toFixed(2)}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="modal-actions">
          <button className="primary-red-btn" onClick={onClose}>
            Confirm Split
          </button>
          <button className="secondary-dark-btn" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default SplitBillModal;
