import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";

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
    <nav className="sticky top-0 px-2 py-4 w-40 h-screen border-r border-gray-200">
      <ul className="flex flex-col items-start whitespace-nowrap">
        <li
          className={`hover:bg-blue-300 hover:text-white w-full px-1.5 py-3 rounded-md ${activeMenu.active(
            "/"
          )}`}
        >
          <Link href="/">
            <span className="flex items-center gap-4">
              <span className="hidden text-lg md:inline">Home</span>
            </span>
          </Link>
        </li>
        <li
          className={`hover:bg-blue-300 hover:text-white w-full px-1.5 py-3 rounded-md ${activeMenu.active(
            "/profile"
          )}`}
        >
          <Link href="/profile">
            <span className="flex items-center gap-4">
              <span className="hidden text-lg md:inline">Profile</span>
            </span>
          </Link>
        </li>
        <li className="hover:bg-blue-300 hover:text-white w-full px-1.5 py-3 rounded-md">
          {user == null ? (
            <button onClick={() => signIn()}>Sign in</button>
          ) : (
            <button onClick={() => signOut()}>Sign out</button>
          )}
        </li>
      </ul>
    </nav>
  );
};

export default SideNav;
