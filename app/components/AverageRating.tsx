"use client";

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
  const [averageRating, setAverageRating] = useState<string | null>(null);

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
  }, []);

  useEffect(() => {
    if (data) {
      const totalRating = data.reduce((acc, item) => acc + item.rating, 0);
      const average = totalRating / data.length;
      setAverageRating(average.toFixed(2));
    }
  }, [data]);

  return (
    <div className="w-full bg-blue-200 rounded-lg h-32 flex flex-col lg:flex-row justify-center lg:justify-between items-center px-5">
      <p className="italic font-light">Average Rating of All Products</p>
      <div className="text-7xl font-semibold">{averageRating}</div>
    </div>
  );
};

export default AverageRating;
