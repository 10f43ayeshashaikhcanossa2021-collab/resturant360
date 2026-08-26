import { useEffect, useState } from "react";
import SearchBar from "./SearchBar";
import CategoryTabs from "./CategoryTabs";
import MenuGrid from "./MenuGrid";
import { getMenu } from "../../services/api";


function MenuSection({ addToCart }) {
  const [search, setSearch] = useState("");
  const [foodType, setFoodType] = useState("All");
  const [category, setCategory] = useState("All");
  const [menuData, setMenuData] = useState([]);

  useEffect(() => {
    const loadMenu = async () => {
      try {
        const data = await getMenu();
        setMenuData(data || []);
      } catch (error) {
        console.error('Failed to load menu:', error);
      }
    };

    loadMenu();
  }, []);
  const filteredMenu = (menuData || []).filter((item) => {
    const matchSearch = item.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchType =
      foodType === "All" || item.type === foodType;

    const matchCategory =
      category === "All" || item.category === category;

    return matchSearch && matchType && matchCategory;
  });

  return (
    <div className="menu-section-container">

      <SearchBar
        search={search}
        setSearch={setSearch}
        foodType={foodType}
        setFoodType={setFoodType}
      />


      <CategoryTabs
        category={category}
        setCategory={setCategory}
      />


      <MenuGrid menu={filteredMenu} addToCart={addToCart} />
    </div>
  );
}

export default MenuSection;
