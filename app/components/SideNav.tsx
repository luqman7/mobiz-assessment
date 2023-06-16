import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { GrHomeRounded, GrLogin, GrLogout } from "react-icons/gr";
import { GoPerson, GoHome } from "react-icons/go";

const SideNav = () => {
  const session = useSession();
  const user = session.data?.user;

  const router = usePathname();

  const activeMenu = {
    active: (url: string) => {
      return url && router.includes(url) ? "bg-blue-300 text-white" : "";
    },
  };

  return (
    <nav className="sticky top-0 px-2 py-4 lg:w-40 h-screen border-r border-gray-200">
      <ul className="flex flex-col items-start whitespace-nowrap">
        <li
          className={`${
            router === "/" ? "bg-blue-300 text-white" : ""
          } hover:bg-blue-300 hover:text-white w-full px-1.5 py-3 rounded-md
          }`}
        >
          <Link href="/">
            <div className="flex items-center gap-4">
              <GoHome />
              <span className="hidden text-lg md:inline">Home</span>
            </div>
          </Link>
        </li>
        <li
          className={`${
            router === "/profile" ? "bg-blue-300 text-white" : ""
          } hover:bg-blue-300 hover:text-white w-full px-1.5 py-3 rounded-md
          }`}
        >
          <Link href="/profile">
            <div className="flex items-center gap-4">
              <GoPerson />
              <span className="hidden text-lg md:inline">Profile</span>
            </div>
          </Link>
        </li>
        <li className="hover:bg-blue-300 hover:text-white w-full px-1.5 py-3 rounded-md">
          {user == null ? (
            <button
              className="flex items-center gap-4"
              onClick={() => signIn()}
            >
              <GrLogin />
              <span className="hidden text-lg md:inline">Sign In</span>
            </button>
          ) : (
            <button
              className="flex items-center gap-4"
              onClick={() => signOut()}
            >
              <GrLogout />
              <span className="hidden text-lg md:inline">Sign Out</span>
            </button>
          )}
        </li>
      </ul>
    </nav>
  );
};

export default SideNav;
