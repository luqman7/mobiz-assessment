"use client";

import axios from "axios";
import { useEffect, useState } from "react";
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

const ProductChart = () => {
  const [categories, setCategories] = useState<
    { category: string; count: number }[]
  >([]);
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
        const response = await axios.get("https://dummyjson.com/products");
        const data = response.data.products; // Assuming the response data is an array of objects with a "category" property
        const countObj: { [key: string]: number } = {};

        // Count the items by category
        data.forEach((item: any) => {
          if (countObj[item.category]) {
            countObj[item.category] += 1;
          } else {
            countObj[item.category] = 1;
          }
        });

        // Create an array of category-count objects
        const categoryList = Object.entries(countObj).map(
          ([category, count]) => ({
            category,
            count,
          })
        );

        setCategories(categoryList);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    setChartData({
      labels: categories.map((category) => category.category),
      datasets: [
        {
          label: "",
          data: categories.map((category) => category.count),
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
          text: "Test 2",
        },
        maintainAspectRatio: false,
        responsive: true,
      },
    });
  }, [categories]);

  return (
    <div className="pt-10">
      {/* <h1>Product Chart</h1> */}
      {/* {categories.map((category, index) => (
        <div key={index}>
          {category.category}: {category.count}
        </div>
      ))} */}
      <div className="h-96 flex items-center justify-center">
        <Bar className="h-full" data={chartData} options={chartOptions} />
      </div>
    </div>
  );
};

export default ProductChart;
