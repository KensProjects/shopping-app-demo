'use client'

import { BASEURL } from "@/app/utils/baseUrl";
import { signOut, useSession } from "next-auth/react";
import { redirect } from "next/navigation";

export default function SignOut() {

  const { data: session } = useSession({
    required: true,
    onUnauthenticated() {
      redirect(`${BASEURL}`)
    },
  });
  async function handleSignOut() {
    await signOut({ callbackUrl:`${BASEURL}` })
  }
  function handleDecline() {
    redirect(`${BASEURL}`)
  }


  if (!session) return null
  
  return (
    <div className="w-full h-full flex justify-center items-center">
      <div className="flex flex-col justify-center gap-8 items-center border border-black h-80 w-full sm:w-2/3 bg-gray-100 mt-8">
        <h2>Signout?</h2>
        <div className="flex flex-col sm:flex-row justify-center items-center w-11/12 gap-8 sm:gap-1">
          <button className="bg-green-500 w-2/3 sm:w-1/2 h-16 rounded-lg hover:bg-green-400 duration-100 ease-in-out" onClick={handleSignOut}>Yes</button>
          <button className="bg-red-500 w-2/3 sm:w-1/2 h-16 rounded-lg hover:bg-red-400 duration-100 ease-in-out" onClick={handleDecline}>No</button>
        </div>
      </div>
    </div>
  );
}
