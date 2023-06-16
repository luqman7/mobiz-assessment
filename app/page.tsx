"use client";
import { useSession } from "next-auth/react";
import AverageRating from "./components/AverageRating";
import ProductChart from "./components/ProductChart";
import SideNav from "./components/SideNav";
import TableProducts from "./components/TableProducts";

export default function Home() {
  const session = useSession();
  const user = session.data?.user;

  return (
    <div className="flex w-full">
      <SideNav />
      {user == null ? (
        <div className="flex justify-center items-center w-full">
          <p>Please log in to view the dashboard</p>
        </div>
      ) : (
        <div className="w-11/12 p-5">
          <AverageRating />
          <ProductChart />
          <TableProducts />
        </div>
      )}
    </div>
  );
}
