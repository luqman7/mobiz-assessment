import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface Product {
  title: string;
  description: string;
  price: number;
  category: string;
  brand: string;
  stock: number;
  thumbnail: string;
}

const TableProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[] | null>(null);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [categoryList, setCategoryList] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [skip, setSkip] = useState<number>(0);
  const limit = 50;

  useEffect(() => {
    fetchData();
    fetchCategoryList();
  }, [skip]);

  useEffect(() => {
    if (selectedCategory !== "") {
      fetchDataByCategory();
    } else {
      fetchData();
    }
  }, [selectedCategory]);

  useEffect(() => {
    if (searchQuery !== "") {
      const newFilteredData =
        products &&
        products.filter(
          (product) =>
            product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.description
              .toLowerCase()
              .includes(searchQuery.toLowerCase())
        );
      setFilteredProducts(newFilteredData || []);
    }
  }, [searchQuery, products]);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `https://dummyjson.com/products?skip=${skip}&limit=${limit}`
      );
      setProducts(response.data.products);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchDataByCategory = async () => {
    try {
      const response = await axios.get(
        `https://dummyjson.com/products/category/${selectedCategory}`
      );
      setProducts(response.data.products);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchCategoryList = async () => {
    try {
      const response = await axios.get(
        "https://dummyjson.com/products/categories"
      );
      setCategoryList(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const renderProducts = () => {
    const dataToRender = searchQuery === "" ? products : filteredProducts;

    return dataToRender!.map((product, index) => (
      <tr key={index}>
        <td className="whitespace-break-spaces">{product.title}</td>
        <td className="whitespace-break-spaces">{product.description}</td>
        <td className="text-center">{product.price}</td>
        <td className="text-center">{product.category}</td>
        <td className="text-center">{product.brand}</td>
        <td className="text-center">{product.stock}</td>
        <td>
          <img src={product.thumbnail} alt="thumbnail_products" />
        </td>
      </tr>
    ));
  };

  const handlePrevious = () => {
    if (skip >= limit) {
      setSkip(skip - limit);
    }
  };

  const handleNext = () => {
    if (skip + limit < 100) {
      setSkip(skip + limit);
    }
  };

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
            className="w-full outline-none"
          >
            <option value="">All Categories</option>
            {categoryList.map((category, index) => (
              <option key={index} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="h-[400px] overflow-auto">
        <table className="w-full whitespace-nowrap text-sm table-auto lg:table-fixed overflow-x-auto">
          <thead>
            <tr className="border-b border-gray-300">
              <th className="py-4 px-2 flex-none">Title</th>
              <th className="py-4 px-2 flex-none">Description</th>
              <th className="py-4 px-2 flex-none">Price</th>
              <th className="py-4 px-2 flex-none">Category</th>
              <th className="py-4 px-2 flex-none">Brand</th>
              <th className="py-4 px-2 flex-none">Stock</th>
              <th className="py-4 px-2 flex-none">Thumbnail</th>
            </tr>
          </thead>
          <tbody>{renderProducts()}</tbody>
        </table>
      </div>
      <div className="flex justify-center mt-4">
        {selectedCategory === "" && (
          <>
            <button
              className={`px-4 py-2 border border-gray-400 rounded-md mr-2 ${
                skip === 0 ? "cursor-not-allowed bg-gray-400 text-gray-500" : ""
              }`}
              onClick={handlePrevious}
            >
              Previous
            </button>
            <button
              className={`px-4 py-2 border border-gray-400 rounded-md mr-2 ${
                skip + limit >= 100
                  ? "cursor-not-allowed bg-gray-400 text-gray-500"
                  : ""
              }`}
              onClick={handleNext}
              disabled={skip + limit >= 100}
            >
              Next
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default TableProducts;
