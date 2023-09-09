"use client";

import AuthForm from "@/app/components/AuthForm";
import { signIn, useSession } from "next-auth/react";
import { FormEvent, useEffect } from "react";
import { credentialsAtom, errorAtom, errorToggleAtom, initialCredentials } from "@/app/context/Atoms";
import { useAtom } from "jotai";
import { redirect } from "next/navigation";
import { BASEURL } from "@/app/utils/baseUrl";
import Spinner from "@/app/components/Spinner";
import Error from "@/app/components/Error";

export default function Login() {


  const [error, setError] = useAtom(errorAtom)
  const [errorToggle, setErrorToggle] = useAtom(errorToggleAtom)

  const { status } = useSession()

  const [credentials, setCredentials] = useAtom(credentialsAtom);

  async function handleSignin(e: FormEvent) {
    e.preventDefault();
    try {
      await signIn("credentials", {
        username: credentials.username,
        password: credentials.password,
        callbackUrl: `${BASEURL}`,
      });
      setCredentials(initialCredentials)
    } catch (error:any) {
      console.log(error)
      // setError(error.toString())
      // setErrorToggle(true)
      // setTimeout(() => {
      //   setErrorToggle(false)
      //   setError("")
      // }, 3000)
    }
  }
  useEffect(() => {
    if (status === 'authenticated') {
      redirect(`${BASEURL}`)
    }
  }, [status])

  if (status === "loading") return <div className="w-screen h-screen flex justify-center items-center"><Spinner /></div>
  
  if (error) return <div className="bg-black-75 w-screen h-screen flex justify-center items-center text-red-500 z-50">
  <p className="text-center text-red-500">{error}</p>
  <Error /></div>


  return (
    <div className="w-full h-screen flex justify-center items-center">
      <AuthForm type="Login" onSubmit={handleSignin} />
    </div>
  );
}
