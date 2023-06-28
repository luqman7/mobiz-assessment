import { useEffect, useState } from "react";
import axios from "axios";

interface Product {
  id: number;
  rating: number;
}

interface ApiResponse {
  products: Product[];
}

const AverageRating = (): JSX.Element => {
  const [data, setData] = useState<Product[] | null>(null);
  const [dataCategory, setDataCategory] = useState<Product[] | null>(null);
  const [category, setCategory] = useState<string[]>([]);
  const [averageRating, setAverageRating] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [categoryName, setCategoryName] = useState("All Products");

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      try {
        const response = await axios.get<ApiResponse>(
          "https://dummyjson.com/products?limit=100"
        );
        setData(response.data.products);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();

    fetchDataAll();

    const fetchCategory = async (): Promise<void> => {
      try {
        const response = await axios.get<string[]>(
          "https://dummyjson.com/products/categories"
        );
        setCategory(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchCategory();
  }, []);

  useEffect(() => {
    if (data) {
      const totalRating = data.reduce((acc, item) => acc + item.rating, 0);
      const average = totalRating / data.length;
      setAverageRating(average.toFixed(2));
    }

    if (dataCategory) {
      const totalRating = dataCategory.reduce(
        (acc, item) => acc + item.rating,
        0
      );
      const average = totalRating / dataCategory.length;
      setAverageRating(average.toFixed(2));
    }
  }, [data, dataCategory]);

  const fetchDataAll = () => {
    if (data) {
      console.log("first");
      const totalRating = data.reduce((acc, item) => acc + item.rating, 0);
      const average = totalRating / data.length;
      setAverageRating(average.toFixed(2));
      setCategoryName("All Products");
    }
  };

  const handleCategoryClick = (categoryItem: string): void => {
    setSelectedCategory(categoryItem);
    setCategoryName(categoryItem);
    fetchDataByCategory(categoryItem);
  };

  const fetchDataByCategory = async (categoryItem: string): Promise<void> => {
    try {
      const response = await axios.get<ApiResponse>(
        `https://dummyjson.com/products/category/${categoryItem}`
      );
      setDataCategory(response.data.products);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <div className="w-full bg-blue-200 rounded-lg h-[450px] lg:h-52 flex flex-col lg:flex-row justify-center lg:justify-between items-center px-5">
      <div>
        <p className="text-center lg:text-left text-sm lg:text-base italic font-light">
          Average Rating of <span className="capitalize">{categoryName}</span>
        </p>
        <div className="">
          <button
            onClick={fetchDataAll}
            className="p-1 rounded-md bg-blue-300 text-xs mx-1"
          >
            All
          </button>
          {category.map((categoryItem) => (
            <button
              className="p-1 rounded-md bg-blue-300 text-xs mx-1"
              key={categoryItem}
              onClick={() => handleCategoryClick(categoryItem)}
            >
              {categoryItem}
            </button>
          ))}
        </div>
      </div>
      <div className="text-7xl font-semibold">{averageRating}</div>
    </div>
  );
};

export default AverageRating;
