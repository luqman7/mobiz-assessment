import { useEffect, useState } from "react";
import axios from "axios";

interface Product {
  title: string;
  description: string;
  price: number;
  category: string;
  brand: string;
  stock: number;
  thumbnail: string;
}

const ui = {
  th: "py-4 px-2 flex-none",
};

const TableProducts = () => {
  const [products, setProducts] = useState<Product[] | null>(null);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedBrand, setSelectedBrand] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("https://dummyjson.com/products");
        setProducts(response.data.products);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    let filteredData = products || [];
    if (selectedCategory !== "") {
      filteredData = filteredData.filter(
        (product) => product.category === selectedCategory
      );
    }
    if (selectedBrand !== "") {
      filteredData = filteredData.filter(
        (product) => product.brand === selectedBrand
      );
    }
    setFilteredProducts(filteredData);
  }, [products, selectedCategory, selectedBrand]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  useEffect(() => {
    let searchData = filteredProducts;
    if (searchQuery !== "") {
      searchData = searchData.filter(
        (product) =>
          product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    setFilteredProducts(searchData);
  }, [searchQuery, filteredProducts]);

  if (!products) {
    return <div>Loading...</div>;
  }

  return (
    <div className="pt-20">
      <div className="pb-5 flex flex-col lg:flex-row">
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearch}
          placeholder="Search by title or description"
          className="w-full lg:w-3/4 border-b border-gray-200 outline-none p-2"
        />
        <div className="w-full lg:w-1/4 flex items-center">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-1/2"
          >
            <option value="">All Categories</option>
            {Array.from(
              new Set(products.map((product) => product.category))
            ).map((category, index) => (
              <option key={index} value={category}>
                {category}
              </option>
            ))}
          </select>
          <select
            value={selectedBrand}
            onChange={(e) => setSelectedBrand(e.target.value)}
            className="w-1/2"
          >
            <option value="">All Brands</option>
            {Array.from(new Set(products.map((product) => product.brand))).map(
              (brand, index) => (
                <option key={index} value={brand}>
                  {brand}
                </option>
              )
            )}
          </select>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full whitespace-nowrap text-sm table-auto lg:table-fixed overflow-x-auto">
          <thead>
            <tr className="border-b border-gray-300">
              <th className={`${ui.th}`}>Title</th>
              <th className={`${ui.th}`}>Description</th>
              <th className={`${ui.th}`}>Price</th>
              <th className={`${ui.th}`}>Category</th>
              <th className={`${ui.th}`}>Brand</th>
              <th className={`${ui.th}`}>Stock</th>
              <th className={`${ui.th}`}>Thumbnail</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product, index) => (
              <tr key={index}>
                <td>{product.title}</td>
                <td className="whitespace-break-spaces">
                  {product.description}
                </td>
                <td className="text-center">{product.price}</td>
                <td className="text-center">{product.category}</td>
                <td className="text-center">{product.brand}</td>
                <td className="text-center">{product.stock}</td>
                <td>
                  <img src={product.thumbnail} alt="thumbnail_products" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TableProducts;
