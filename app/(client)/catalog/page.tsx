"use client";

import { useAtom } from "jotai";
import { TItem, cartAtom, catalogAtom, errorAtom, errorToggleAtom, searchTermAtom } from "@/app/context/Atoms";
import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { ItemList } from "@/app/utils/ItemList";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { BASEURL } from "@/app/utils/baseUrl";
import Spinner from "@/app/components/Spinner";
import Error from "@/app/components/Error";

// import { Session } from "next-auth";

// export interface ISession extends Session {
//   user:{id?:string}
// }

export default function Catalog() {

  const [error, setError] = useAtom(errorAtom)
  const [errorToggle, setErrorToggle] = useAtom(errorToggleAtom)

  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      redirect(`${BASEURL}/`)
    },
  });

  const queryClient = useQueryClient();

  const [catalog, setCatalog] = useAtom(catalogAtom);
  const [cart, setCart] = useAtom(cartAtom);

  async function addItem(itemName: string) {
    try {
      const pickedItem = ItemList.find((item) => {
        return item.name.toLowerCase() === itemName.toLowerCase();
      });
      if (!pickedItem) return console.log("picked not found");
      const itemInCart = cart.find((item) => {
        return item.name.toLowerCase() === itemName.toLowerCase();
      });
      if (itemInCart) {
        const res = await axios.put(`${BASEURL}/api/cart/`, {
          name: itemName,
          type: "increment",
          userId: session?.user.id,
        });
        const data = await res.data;
        setCart(data)
      } else {
        const res = await axios.post(`${BASEURL}/api/cart`, {
          ...pickedItem,
          userId: session?.user.id,
        });
        const data = await res.data;
        setCart([...cart, data]);
        return data;
      }
    } catch (error:any) {
      setError(error.toString())
      setErrorToggle(true)
      setTimeout(() => {
        setErrorToggle(false)
        setError("")
      }, 3000)
    }
  }
  async function getCart() {
    try {
      const res = await axios.get(`${BASEURL}/api/cart`);
      const data = await res.data;
      setCart(data.cart);
      return data;
    } catch (error:any) {
      setError(error.message)
      setErrorToggle(true)
      setTimeout(() => {
        setErrorToggle(false)
        setError("")
      }, 3000)
    }
  }
  const { data: cartData } = useQuery({
    queryKey: ["cart"],
    queryFn: getCart,
  });
  const addItemMutation = useMutation({
    mutationFn: addItem,
    onSuccess: () => queryClient.invalidateQueries(["cart"]),
  });
  useEffect(() => {
    function checkSearch() {
      const existingSearch = localStorage.getItem("searchItem")
      const urlContainsQuery = window.location.href.includes("?")
      if (existingSearch && urlContainsQuery) {
        setCatalog(ItemList.filter((item: TItem) => item.name.toLowerCase().includes(
          existingSearch.toLowerCase())))
      } else {
        localStorage.removeItem("searchItem")
        setCatalog(ItemList)
      }
    }
    checkSearch()
    setCart(cartData?.cart);
  }, []);

  if (status === "loading") return <div className="w-screen h-screen flex justify-center items-center"><Spinner /></div>

  if (error) return <div className="bg-black-75 w-screen h-screen flex justify-center items-center text-red-500 z-50">
  <p className="text-center text-red-500">{error}</p>
  <Error /></div>


  return (
    <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 m-4 gap-1">
      {catalog.map((fitleredItem: TItem) => {
        return (
          <li
            key={fitleredItem.name}
            className="flex justify-center items-center flex-col border border-black m-2 w-full p-2"
          >
            <div>{fitleredItem.name}</div>
            <div>${fitleredItem.price.toFixed(2)}</div>
            {addItemMutation.isLoading ?
              <button className="bg-gray-300 text-black w-3/4 rounded-xl" disabled>Loading</button>
              :
              <button onClick={() => addItemMutation.mutate(fitleredItem.name)} className="bg-blue-500 hover:bg-blue-400 duration-100 text-white w-3/4 rounded-xl">
                Add to Cart
              </button>
            }

          </li>
        );
      })}
    </ul>
  );
}
