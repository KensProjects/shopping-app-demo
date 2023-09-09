"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import User from "./User";
import axios from "axios";
import { TItem, errorAtom, errorToggleAtom } from "@/app/context/Atoms";
import { BASEURL } from "@/app/utils/baseUrl";
import { useAtom } from "jotai";

export default function NavbarLinks() {
  const { status } = useSession();
  const [error, setError] = useAtom(errorAtom)
  const [errorToggle, setErrorToggle] = useAtom(errorToggleAtom)

  async function getCart() {
    try {
      const res = await axios.get(`${BASEURL}/api/cart`);
      const data = await res.data;
      return data;
    } catch (error: any) {
      setError("Error!")
      setErrorToggle(true)
      setTimeout(() => {
        setErrorToggle(false)
        setError("")
      }, 3000)
    }
  }

  const { data: cartData, isLoading: loading } = useQuery({
    queryKey: ["cart"],
    queryFn: getCart,
  });

  const subTotalAmt: number = parseInt(cartData?.cart
    .reduce(
      (sum: number, item: TItem) => sum + item.quantity * item.price,
      0
    )
    .toFixed(2))

  const totalAmt: number = Number((subTotalAmt).toFixed(2))



  return (

    <ul className="hidden md:flex gap-4 pr-2">
      <li className="flex justify-center items-center bg-blue-400 hover:bg-blue-500 duration-100 rounded-lg px-3 py-1 cursor-pointer">
        <Link href="/catalog">Catalog</Link>
      </li>

      {status === "authenticated" ? (
        <>
          <li className="flex justify-center items-center bg-blue-400 hover:bg-blue-500 duration-100 rounded-lg px-3 py-1 cursor-pointer">
            <div className="flex flex-col text-center">
              <h1 className="text-xs">
                {loading ? 'Loading' : (`$${totalAmt}`)}
              </h1>
              <Link href="/cart">Cart</Link>
            </div>
          </li>

          <li className="flex justify-center items-center bg-blue-400 hover:bg-blue-500 duration-100 rounded-lg px-3 py-1 cursor-pointer">
            <div className="flex flex-col justify-center items-center">
              <User />
              <Link href="/signout">Signout</Link></div>
          </li>
        </>
      ) : (
        <>
          <li className="flex justify-center items-center bg-blue-400 hover:bg-blue-500 duration-100 rounded-lg px-3 py-1 cursor-pointer">
            <Link href="/login">Signin</Link>
          </li>
          <li className="flex justify-center items-center bg-blue-400 hover:bg-blue-500 duration-100 rounded-lg px-3 py-1 cursor-pointer">
            <Link href="/register">Register</Link>
          </li>
        </>

      )}
    </ul>
  );
}
