"use client";

import { useSession } from "next-auth/react";
import Image from "next/image";
import Spinner from "./Spinner";

export default function Landing() {
  const { status } = useSession();


  if (status === 'loading') {
    
    return <div className="w-screen h-screen flex justify-center items-center"><Spinner /></div>

  } else {

    return (
      <div className="m-4 px-4 w-auto h-56 flex flex-col lg:flex-row justify-around items-center mt-20 border-black border text-lg">
        <h2>Welcome to my shopping app demo!</h2>
        <div className="flex gap-4">
          {status === "unauthenticated" ? (
            <p>Please register or login to begin shopping!</p>) : (<p>Please visit the catalog to begin shopping!</p>)
          }
        </div>
        <div className="overflow-hidden">
          <Image
            src="/shopping-cart-landing.svg"
            alt="cart"
            width={150}
            height={150}
            priority
          />
        </div>
      </div>
    );
  }
}