const categories = [
  "All",
  "Starters",
  "Main Course",
  "Breads",
  "Beverages",
  "Desserts",
];


function CategoryTabs({ category, setCategory }) {
  return (
    <div className="category-tabs-container">
      {categories.map((item) => (
        <button
          key={item}
          className={category === item ? "category-tab active" : "category-tab"}
          onClick={() => setCategory(item)}
        >
          {item}
        </button>
      ))}
    </div>
  );
}

export default CategoryTabs;
