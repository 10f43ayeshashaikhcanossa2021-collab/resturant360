import MenuCard from "./MenuCard";


function MenuGrid({ menu, addToCart }) {
  return (
    <div className="dishes-grid">
      {menu.map((item) => (
        <MenuCard key={item.id} item={item} addToCart={addToCart} />
      ))}
    </div>
  );
}

export default MenuGrid;
