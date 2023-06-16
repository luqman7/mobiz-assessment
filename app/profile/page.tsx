"use client";
import { useSession, signIn } from "next-auth/react";
import SideNav from "../components/SideNav";
import Image from "next/image";

const Page = () => {
  const session = useSession();
  const user = session.data?.user;

  const imagePath = user?.image || "";

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
            to view your profile
          </p>
        </div>
      ) : (
        <div className="w-11/12 flex justify-center items-center">
          <div className="flex flex-col items-center gap-y-6">
            <Image
              src={imagePath}
              alt="profile pic"
              width={150}
              height={150}
              className="rounded-full"
            />
            <h1 className="text-4xl text-center">
              {user?.name}&apos;s Profile
            </h1>
            <p>{user?.email}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;
