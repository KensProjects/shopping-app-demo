"use client";

import { useSession } from "next-auth/react";
import Spinner from "../Spinner";

export default function User() {
  const { data: session, status } = useSession();

  if (status === "authenticated") {
    return <div className="flex justify-center items-center text-center text-xs">Welcome, {session?.user.username}</div>;
  }
  if (status === 'loading') return <Spinner />


  return <div>Please login</div>;
}
