"use client";
import { useSession, signIn } from "next-auth/react";
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
          <p>
            Please{" "}
            <span
              onClick={() => signIn()}
              className="bg-yellow-400 text-white py-1 px-2.5 rounded-md cursor-pointer"
            >
              log in
            </span>{" "}
            to view the dashboard
          </p>
        </div>
      ) : (
        <div className="w-11/12 p-3 lg:p-5 overflow-y-auto">
          <AverageRating />
          <ProductChart />
          <TableProducts />
        </div>
      )}
    </div>
  );
}
