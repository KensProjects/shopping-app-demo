"use client";

import axios from "axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { TItem, errorAtom, errorToggleAtom } from "@/app/context/Atoms";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { BASEURL } from "@/app/utils/baseUrl";
import Spinner from "@/app/components/Spinner";
import { useAtom } from "jotai";
import Error from "@/app/components/Error";

export default function Cart() {


  const [error, setError] = useAtom(errorAtom)
  const [errorToggle, setErrorToggle] = useAtom(errorToggleAtom)

  const { data: session } = useSession({
    required: true,
    onUnauthenticated() {
      redirect(`${BASEURL}`)
    },
  });

  const queryClient = useQueryClient();

  async function increaseQuantity({ id }: { id: string }) {
    try {
      const res = await axios.put(`${BASEURL}/api/cart/`, {
        id,
        type: "increment",
        userId: session?.user?.id,
      });
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
  async function decreaseQuantity({ id }: { id: string }) {
    try {
      const res = await axios.put(`${BASEURL}/api/cart/`, {
        id,
        type: "decrement",
        userId: session?.user?.id,
      });
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
  const { data: cartData, isLoading: cartDataLoading } = useQuery({
    queryKey: ["cart"],
    queryFn: getCart,
  });

  const { mutate: increaseMutation, isLoading: increaseLoading } = useMutation({
    mutationFn: increaseQuantity,
    onSuccess: () => queryClient.invalidateQueries(["cart"]),
  });
  const { mutate: decreaseMutation, isLoading: decreaseLoading } = useMutation({
    mutationFn: decreaseQuantity,
    onSuccess: () => queryClient.invalidateQueries(["cart"]),
  });

  const totalAmt: number = (cartData?.cart
    .reduce(
      (sum: number, item: TItem) => sum + item.quantity * item.price,
      0
    )
    .toFixed(2))




  if (cartDataLoading || decreaseLoading || increaseLoading)
    return <div className="w-screen h-screen flex justify-center items-center"><Spinner /></div>

  if (!cartData) return (<div>Please add items to your cart!</div>)

  if (error) return <div className="bg-black-75 w-screen h-screen flex justify-center items-center text-red-500 z-50">
    <Error /></div>

  return (
    <div className="flex flex-col sm:flex-row w-full h-full">
      <div className="flex flex-col justify-center items-center gap-8 m-1 w-full sm:w-9/12">
        <ul className="grid  grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 justify-between items-center gap-4 w-full">
          {cartData?.cart.map((item: TItem) => {
            return (
              <li
                key={item.id}
                className="flex flex-col justify-center items-center gap-2 border border-black p-1"
              >
                <div>{item.name}</div>
                <div>Price: ${item.price?.toFixed(2)}</div>
                <div>Quantity: {item.quantity}</div>
                <div className="flex gap-2 justify-center w-full">
                  <button onClick={() => decreaseMutation({ id: item.id! })} className="bg-red-400 h-8 w-24 rounded-lg hover:bg-red-300 duration-100 ease-in-out">
                    Decrease
                  </button>
                  <button onClick={() => increaseMutation({ id: item.id! })} className="bg-green-400 h-8 w-24 rounded-lg hover:bg-green-300 duration-100 ease-in-out">
                    Increase
                  </button></div>
              </li>
            );
          })}
        </ul>

      </div>
      <div className="sm:flex sm:flex-col justify-center items-center gap-8 m-1 w-full sm:w-3/12">

        <div className="border border-black flex flex-col justify-center items-center gap-2 w-full h-full">

          <div className="">
            <h2>Order Type</h2>
            <select className="border border-black">
              <option value={'Delivery'}>Delivery</option>
              <option value={'Pickup'}>Pickup</option>
            </select>
          </div>

          <h2>Timeslot</h2>
          <select className="border border-black">
            <option value={'9am-10am'}>9am-10am</option>
            <option value={'10am-11am'}>10am-11am</option>
            <option value={'11am-12pm'}>11am-12pm</option>
            <option value={'12pm-1pm'}>12pm-1pm</option>
            <option value={'1pm-2pm'}>1pm-2pm</option>

          </select>

          <div className="flex flex-col justify-center items-center gap-1">
            <h2 className="">Total: ${totalAmt}</h2>
          </div>


          <button disabled type="button" className="bg-gray-200 h-8 w-11/12 sm:w-32 flex justify-center items-center rounded-lg cursor-pointer border border-black hover:bg-gray-100 duration-100 ease-out">Checkout</button>

        </div>

      </div>

    </div>

  );
}
