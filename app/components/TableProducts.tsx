import { useEffect, useState } from "react";
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

const ui = {
  th: "py-4 px-2 flex-none",
};

const TableProducts = () => {
  const [products, setProducts] = useState<Product[] | null>(null);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedBrand, setSelectedBrand] = useState<string>("");
  const [skip, setSkip] = useState<number>(0);
  const [limit, setLimit] = useState<number>(50);
  const [chartData, setChartData] = useState<{
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      borderColor: string;
      backgroundColor: string;
    }[];
  }>({ labels: [], datasets: [] });
  const [chartOptions, setChartOptions] = useState({});

  useEffect(() => {
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

    fetchData();
  }, [skip, limit]);

  useEffect(() => {
    let filteredData: Product[] = products || [];
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

    const categories: string[] = Array.from(
      new Set(filteredData.map((product) => product.category))
    );

    console.log("Categories:", categories);

    const productsByCategory: number[] = categories.map((category) => {
      return filteredData.filter((product) => product.category === category)
        .length;
    });

    console.log("Products by Category:", productsByCategory);

    setChartData({
      labels: categories,
      datasets: [
        {
          label: "",
          data: productsByCategory,
          borderColor: "rgb(53,162,235)",
          backgroundColor: "rgb(53, 162, 235, 0.4)",
        },
      ],
    });

    setChartOptions({
      plugins: {
        legend: {
          position: "top",
        },
        title: {
          display: true,
          text: "Count of Searched Products by Category",
        },
      },
      maintainAspectRatio: false,
    });
  }, [products, selectedCategory, selectedBrand]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  useEffect(() => {
    let searchData = products || [];
    if (searchQuery !== "") {
      searchData = searchData.filter(
        (product) =>
          product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (searchData !== filteredProducts) {
      setFilteredProducts(searchData);
    }

    const uniqueCategoriesSet = new Set(
      searchData.map((product) => product.category)
    );
    const uniqueCategories = Array.from(uniqueCategoriesSet);

    const productsByCategory = uniqueCategories.map(
      (category) =>
        searchData.filter((product) => product.category === category).length
    );

    console.log(uniqueCategories);
    console.log(productsByCategory);

    setChartData({
      labels: uniqueCategories,
      datasets: [
        {
          label: "",
          data: productsByCategory,
          borderColor: "rgb(53,162,235)",
          backgroundColor: "rgb(53, 162, 235, 0.4)",
        },
      ],
    });

    setChartOptions({
      plugins: {
        legend: {
          position: "top",
        },
        title: {
          display: true,
          text: "Count of Searched Products by Category",
        },
      },
      maintainAspectRatio: false,
    });
  }, [searchQuery, products]);

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
      <div className=" h-[400px] overflow-auto">
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
      <div className="flex justify-center mt-4">
        <button
          className={`px-4 py-2 border border-gray-400 rounded-md mr-2 ${
            skip === 0 ? "cursor-not-allowed bg-gray-400 text-gray-500" : ""
          }`}
          onClick={() => setSkip(skip - limit)}
        >
          Previous
        </button>
        <button
          className={`px-4 py-2 border border-gray-400 rounded-md mr-2 ${
            skip + limit >= 100
              ? "cursor-not-allowed bg-gray-400 text-gray-500"
              : ""
          }`}
          onClick={() => setSkip(skip + limit)}
          disabled={skip + limit >= 100}
        >
          Next
        </button>
      </div>
      {(searchQuery !== "" ||
        selectedCategory !== "" ||
        selectedBrand !== "") && (
        <div className=" pt-14 flex items-center justify-center">
          <div className="h-96 lg:w-[700px]">
            <Bar data={chartData} options={chartOptions} />
          </div>
        </div>
      )}
    </div>
  );
};

export default TableProducts;
