"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import SearchBar from "./SearchBar";
import NavbarLinks from "./NavbarLinks";
import Spinner from "../Spinner";
import Hamburger from "./Hamburger";
import MobileMenu from "../MobileMenu";

export default function Navbar() {
  const { status } = useSession()

  if (status === 'loading') {
    return (
      <nav className="flex justify-center items-center bg-blue-600 text-yellow-400 h-20 overflow-visible border-b border-black px-4">
        <div className="w-screen h-screen flex justify-center items-center"><Spinner /></div>

      </nav>
    )
  } else {
    return (
      <nav className="flex justify-start md:justify-between items-center bg-blue-600 text-yellow-400 h-20 overflow-visible border-b border-black px-4">
        <MobileMenu />
        <Link href="/" className="hidden md:flex">Shopping App Demo</Link>
        <SearchBar />
        <NavbarLinks />
        <Hamburger />
      </nav>
    );
  }
}