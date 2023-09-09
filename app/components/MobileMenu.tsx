"use client"
import { useAtom } from "jotai"
import Link from "next/link"
import { TItem, mobileToggleAtom } from "../context/Atoms"
import Hamburger from "./navbar/Hamburger"
import axios from "axios"
import { useQuery } from "@tanstack/react-query"
import { BASEURL } from "../utils/baseUrl"
import { useSession } from "next-auth/react"


export default function MobileMenu() {

  const { data: session } = useSession()

  const [mobileToggle, setMobileToggle] = useAtom(mobileToggleAtom)

  async function getCart() {
    if (!session) return
    try {
      const res = await axios.get(`${BASEURL}/api/cart`);
      const data = await res.data;
      return data;
    } catch {
      return

    }
  }

  const { data: cartData, isLoading: loading } = useQuery({
    queryKey: ["cart"],
    queryFn: getCart,
  });

  const totalAmt: number = parseInt(cartData?.cart
    .reduce(
      (sum: number, item: TItem) => sum + item.quantity * item.price,
      0
    )
    .toFixed(2))


  if (mobileToggle) return (

    <div className={`bg-black/25 text-black z-45 absolute top-0 right-0 justify-center items-center flex z-50 ${mobileToggle ? "w-full h-full" : "w-0 h-0"} duration-300 text-center md:hidden`} >
      <div className="bg-yellow-300 h-full w-1/2 flex flex-col justify-center items-center absolute top-0 right-0 z-50 px-1">
        <ul className="flex flex-col justify-center gap-1 items-center w-full h-full">
          <li className="w-full sm:w-10/12 h-16 flex justify-center items-center border border-black py-2">
            <Link className="w-full h-full flex justify-center items-center" href="/" onClick={() => setMobileToggle(prev => !prev)}>Shopping App Demo</Link>
          </li>
          {!session &&
            <div className="w-full">
              <li className="w-full sm:w-10/12 h-16 flex justify-center items-center border border-black py-2"><Link href={"/login"} onClick={e => setMobileToggle(prev => !prev)}>Login</Link></li>
              <li className="w-full sm:w-10/12 h-16 flex justify-center items-center border border-black py-2"><Link href={"/register"} onClick={() => setMobileToggle(prev => !prev)}>Register</Link></li>
            </div>

          }
          {session && <li className="w-full sm:w-10/12 h-16 flex justify-center items-center border border-black py-2">
            <Link className="w-full h-full flex justify-center items-center" href={"/catalog"} onClick={e => setMobileToggle(prev => !prev)}>Catalog</Link>
          </li>}
          {session && <li className="w-full sm:w-10/12  h-16 flex flex-col justify-center items-center border border-black py-2">
            <div>
              <h1>{loading ? 'Loading' : (`$${totalAmt}`)}
              </h1>
              <Link className="flex justify-center items-center" href="/cart" onClick={e => setMobileToggle(prev => !prev)}>Cart</Link></div>
          </li>}
          {session && <li className="w-full h-16 flex justify-center items-center border border-black py-2 sm:w-10/12 ">
            <Link className="w-full h-full flex justify-center items-center" href={"/signout"} onClick={e => setMobileToggle(prev => !prev)}>Sign Out</Link>
          </li>}
        </ul>
      </div>
      <Hamburger />
    </div>

  )

}
