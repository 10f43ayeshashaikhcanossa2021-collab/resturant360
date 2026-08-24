import { FaPlus } from "react-icons/fa";


function MenuCard({ item, addToCart }) {
  return (
    <div className="dish-card">

      <div className="card-top-row">
        <div className={`diet-icon ${item.type === "Veg" ? "veg" : "non-veg"}`}>
          <span className="dot"></span>
        </div>

        <span className="category-tag">
          {item.category.toUpperCase()}
        </span>
      </div>


      <h3 className="dish-title">{item.name}</h3>


      <div className="card-bottom-row">
        <span className="dish-price">₹{item.price}</span>

        <button
          className="add-item-btn"
          onClick={() => addToCart(item)}
          title="Add to cart"
        >
          <FaPlus />
        </button>
      </div>
    </div>
  );
}

export default MenuCard;
