import { useState, useEffect, useRef } from "react";
import {
  FaClock,
  FaUtensils,
  FaSync,
  FaChevronRight,
  FaExclamationTriangle,
  FaCheckCircle,
  FaHandPaper,
  FaCheck
} from "react-icons/fa";
import { getKdsTickets, advanceKdsTicket } from "../services/api";
import "../styles/kds.css";


function SlidableKotCard({ ticket, onAdvance, toggleItemCheck, getTimerUrgency, getElapsedString }) {
  const cardRef = useRef(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isSliding, setIsSliding] = useState(false);
  const startPosRef = useRef({ x: 0, y: 0 });
  const handleTouchStart = (clientX, clientY) => {
    setIsSliding(true);
    startPosRef.current = { x: clientX - dragOffset.x, y: clientY - dragOffset.y };
  };

  const handleTouchMove = (clientX, clientY) => {
    if (!isSliding) return;
    const deltaX = clientX - startPosRef.current.x;
    const deltaY = clientY - startPosRef.current.y;
    if (deltaX >= 0) {
      setDragOffset({ x: deltaX, y: deltaY * 0.2 });
    }
  };

  const handleTouchEnd = () => {
    if (!isSliding) return;
    setIsSliding(false);
    if (dragOffset.x > 60) {
      setDragOffset({ x: 200, y: 0 });
      setTimeout(() => {
        onAdvance(ticket.id, ticket.stage);
        setDragOffset({ x: 0, y: 0 });
      }, 120);
    } else {
      setDragOffset({ x: 0, y: 0 });
    }
  };
  const handleNativeDragStart = (e) => {
    e.dataTransfer.setData("text/plain", ticket.id.toString());
    e.dataTransfer.effectAllowed = "move";
  };

  const nextStageText =
    ticket.stage === "new"
      ? "➜ Slide right to Start Preparing"
      : ticket.stage === "preparing"
      ? "➜ Slide right to Mark Ready"
      : "➜ Slide right or Click to Complete";

  return (
    <div
      ref={cardRef}
      className={`kot-card ${ticket.stage === "ready" ? "ready-card-theme" : ""} ${
        isSliding ? "is-dragging-card" : ""
      }`}
      draggable={true}
      onDragStart={handleNativeDragStart}
      style={{
        transform: isSliding ? `translate(${dragOffset.x}px, ${dragOffset.y}px)` : "none",
        transition: isSliding ? "none" : "transform 0.2s cubic-bezier(0.2, 0, 0, 1)"
      }}
      onTouchStart={(e) => handleTouchStart(e.touches[0].clientX, e.touches[0].clientY)}
      onTouchMove={(e) => handleTouchMove(e.touches[0].clientX, e.touches[0].clientY)}
      onTouchEnd={handleTouchEnd}
      onMouseDown={(e) => {
        if (
          e.target.tagName !== "INPUT" &&
          e.target.tagName !== "BUTTON" &&
          !e.target.closest("button")
        ) {
          handleTouchStart(e.clientX, e.clientY);
        }
      }}
      onMouseMove={(e) => {
        if (isSliding) handleTouchMove(e.clientX, e.clientY);
      }}
      onMouseUp={handleTouchEnd}
      onMouseLeave={handleTouchEnd}
    >

      <div className="kot-card-header">
        <div className="kot-id-badge">
          <span>{ticket.ticketNo}</span>
          <span className="kot-type-tag">{ticket.location}</span>
        </div>

        <div className={`kot-timer-pill ${getTimerUrgency(ticket.startTime)}`}>
          <FaClock />
          <span>{getElapsedString(ticket.startTime)}</span>
        </div>
      </div>


      <div className="kot-items-list">
        {ticket.items.map((item) => (
          <div
            key={item.id}
            className="kot-item-row"
            onClick={(e) => {
              e.stopPropagation();
              toggleItemCheck(ticket.id, item.id);
            }}
          >
            <div className="kot-item-left">
              <input
                type="checkbox"
                className="item-checkbox"
                checked={item.checked}
                onChange={() => {}}
              />
              <span className="item-qty">{item.qty}x</span>
              <span className={`item-name-text ${item.checked ? "checked" : ""}`}>
                {item.name}
              </span>
            </div>
          </div>
        ))}
      </div>


      {ticket.notes && (
        <div className="special-notes-box">
          <FaExclamationTriangle />
          <span>{ticket.notes}</span>
        </div>
      )}


      <div
        className="card-slide-footer"
        onClick={(e) => {
          e.stopPropagation();
          onAdvance(ticket.id, ticket.stage);
        }}
      >
        <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <FaHandPaper /> {nextStageText}
        </span>

        {ticket.stage === "ready" ? (
          <button
            className="done-action-btn"
            onClick={(e) => {
              e.stopPropagation();
              onAdvance(ticket.id, "ready");
            }}
          >
            <FaCheck /> Mark Served
          </button>
        ) : (
          <FaChevronRight className="slide-hint-arrow" />
        )}
      </div>
    </div>
  );
}


function KDS() {
  const [filterType, setFilterType] = useState("All");
  const [dragOverColumn, setDragOverColumn] = useState(null);

  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    const loadTickets = async () => {
      try {
        const data = await getKdsTickets();
        setTickets(data || []);
      } catch (error) {
        console.error('Failed to load KDS tickets:', error);
      }
    };

    loadTickets();
  }, []);
  const [, setNow] = useState(Date.now());
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);
  const filteredTickets = tickets.filter((t) => {
    if (filterType === "All") return true;
    return t.orderType.toLowerCase() === filterType.toLowerCase();
  });

  const newTickets = filteredTickets.filter((t) => t.stage === "new");
  const preparingTickets = filteredTickets.filter((t) => t.stage === "preparing");
  const readyTickets = filteredTickets.filter((t) => t.stage === "ready");
  const advanceStage = async (id, currentStage) => {
    try {
      await advanceKdsTicket(id);
    } catch (error) {
      console.error('Failed to advance KDS ticket:', error);
    }

    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      osc.type = "sine";
      osc.frequency.setValueAtTime(currentStage === "ready" ? 880 : 587.33, audioCtx.currentTime);
      osc.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.12);
    } catch {}

    setTickets((prev) =>
      prev
        .map((t) => {
          if (t.id === id) {
            if (currentStage === "new") return { ...t, stage: "preparing" };
            if (currentStage === "preparing") return { ...t, stage: "ready" };
            if (currentStage === "ready") return null;
          }
          return t;
        })
        .filter(Boolean)
    );
  };
  const moveTicketToStage = (ticketId, newStage) => {
    setTickets((prev) =>
      prev.map((t) => (t.id === Number(ticketId) ? { ...t, stage: newStage } : t))
    );
  };
  const toggleItemCheck = (ticketId, itemId) => {
    setTickets((prev) =>
      prev.map((t) => {
        if (t.id === ticketId) {
          const updatedItems = t.items.map((i) =>
            i.id === itemId ? { ...i, checked: !i.checked } : i
          );
          return { ...t, items: updatedItems };
        }
        return t;
      })
    );
  };
  const handleRefresh = () => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      osc.type = "sine";
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime);
      osc.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.15);
    } catch {}
  };
  const getElapsedString = (startTime) => {
    const elapsedSec = Math.floor((Date.now() - startTime) / 1000);
    const mins = Math.floor(elapsedSec / 60);
    const secs = elapsedSec % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")} mins`;
  };

  const getTimerUrgency = (startTime) => {
    const mins = (Date.now() - startTime) / 1000 / 60;
    if (mins >= 20) return "urgent";
    if (mins >= 10) return "warning";
    return "normal";
  };

  return (
    <div className="kds-page">

      <div className="kds-header">
        <div className="kds-title-area">
          <h1>Kitchen Display (KDS)</h1>
          <p>Real-time kitchen order tracking.</p>
        </div>
      </div>


      <div className="kds-toolbar">

        <div className="kds-filters">
          {["All", "Dine-in", "Takeaway", "Delivery"].map((type) => (
            <button
              key={type}
              className={`filter-tab-btn ${filterType === type ? "active" : ""}`}
              onClick={() => setFilterType(type)}
            >
              {type}
            </button>
          ))}
        </div>


        <div className="kds-counters">
          <span className="counter-badge new">New: {newTickets.length}</span>
          <span className="counter-badge preparing">Preparing: {preparingTickets.length}</span>
          <span className="counter-badge ready">Ready: {readyTickets.length}</span>

          <button className="refresh-kots-btn" onClick={handleRefresh}>
            <FaSync /> Refresh KOTs
          </button>
        </div>
      </div>


      <div className="kds-kanban-board">

        <div
          className={`kanban-column ${dragOverColumn === "new" ? "drag-over" : ""}`}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOverColumn("new");
          }}
          onDragLeave={() => setDragOverColumn(null)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOverColumn(null);
            const id = e.dataTransfer.getData("text/plain");
            if (id) moveTicketToStage(id, "new");
          }}
        >
          <div className="column-header">
            <div className="column-title-group">
              <span className="column-title">New Orders</span>
            </div>
            <span className="column-count-pill">{newTickets.length}</span>
          </div>

          <div className="column-tickets-list">
            {newTickets.length === 0 ? (
              <div className="empty-column-msg">
                <FaCheckCircle className="empty-icon" />
                <span>No new orders</span>
              </div>
            ) : (
              newTickets.map((t) => (
                <SlidableKotCard
                  key={t.id}
                  ticket={t}
                  onAdvance={advanceStage}
                  toggleItemCheck={toggleItemCheck}
                  getTimerUrgency={getTimerUrgency}
                  getElapsedString={getElapsedString}
                />
              ))
            )}
          </div>
        </div>


        <div
          className={`kanban-column ${dragOverColumn === "preparing" ? "drag-over" : ""}`}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOverColumn("preparing");
          }}
          onDragLeave={() => setDragOverColumn(null)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOverColumn(null);
            const id = e.dataTransfer.getData("text/plain");
            if (id) moveTicketToStage(id, "preparing");
          }}
        >
          <div className="column-header">
            <div className="column-title-group">
              <span className="column-title">Preparing</span>
            </div>
            <span className="column-count-pill">{preparingTickets.length}</span>
          </div>

          <div className="column-tickets-list">
            {preparingTickets.length === 0 ? (
              <div className="empty-column-msg">
                <FaUtensils className="empty-icon" />
                <span>Nothing preparing</span>
              </div>
            ) : (
              preparingTickets.map((t) => (
                <SlidableKotCard
                  key={t.id}
                  ticket={t}
                  onAdvance={advanceStage}
                  toggleItemCheck={toggleItemCheck}
                  getTimerUrgency={getTimerUrgency}
                  getElapsedString={getElapsedString}
                />
              ))
            )}
          </div>
        </div>


        <div
          className={`kanban-column ${dragOverColumn === "ready" ? "drag-over" : ""}`}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOverColumn("ready");
          }}
          onDragLeave={() => setDragOverColumn(null)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOverColumn(null);
            const id = e.dataTransfer.getData("text/plain");
            if (id) moveTicketToStage(id, "ready");
          }}
        >
          <div className="column-header">
            <div className="column-title-group">
              <span className="column-title">Ready for Pickup</span>
            </div>
            <span className="column-count-pill">{readyTickets.length}</span>
          </div>

          <div className="column-tickets-list">
            {readyTickets.length === 0 ? (
              <div className="empty-column-msg">
                <FaCheckCircle className="empty-icon" />
                <span>No orders ready</span>
              </div>
            ) : (
              readyTickets.map((t) => (
                <SlidableKotCard
                  key={t.id}
                  ticket={t}
                  onAdvance={advanceStage}
                  toggleItemCheck={toggleItemCheck}
                  getTimerUrgency={getTimerUrgency}
                  getElapsedString={getElapsedString}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default KDS;
