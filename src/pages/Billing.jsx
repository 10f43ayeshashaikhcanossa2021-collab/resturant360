import { useState } from "react";
import MenuSection from "../components/billing/MenuSection";
import CartSection from "../components/billing/CartSection";
import "../styles/billing.css";


function Billing() {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Paneer Tikka",
      category: "Starters",
      type: "Veg",
      price: 280,
      qty: 1
    }
  ]);

  const addToCart = (dish) => {
    setCartItems((prevItems) => {
      const existing = prevItems.find((item) => item.id === dish.id);
      if (existing) {
        return prevItems.map((item) =>
          item.id === dish.id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...prevItems, { ...dish, qty: 1 }];
    });
  };

  return (
    <div className="billing-page-layout">
      <div className="billing-left-panel">
        <MenuSection addToCart={addToCart} />
      </div>

      <div className="billing-right-panel">
        <CartSection
          cartItems={cartItems}
          setCartItems={setCartItems}
          addToCart={addToCart}
        />
      </div>
    </div>
  );
}

export default Billing;
