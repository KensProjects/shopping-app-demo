"use client";

import AuthForm from "@/app/components/AuthForm";
import { credentialsAtom, errorAtom, errorToggleAtom, initialCredentials } from "@/app/context/Atoms";
import axios from "axios";
import { useAtom } from "jotai";
import { FormEvent, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { BASEURL } from "@/app/utils/baseUrl";
import Spinner from "@/app/components/Spinner";
import Error from "@/app/components/Error";

export default function Register() {

  const [error, setError] = useAtom(errorAtom)
  const [errorToggle, setErrorToggle] = useAtom(errorToggleAtom)
  
  const [credentials, setCredentials] = useAtom(credentialsAtom);
  const { status } = useSession()

  async function handleRegistration(e: FormEvent) {
    e.preventDefault();
    try {
      await axios.post(`${BASEURL}/api/register`, {
        username: credentials.username,
        password: credentials.password,
      });
      await signIn("credentials", {
        username: credentials.username,
        password: credentials.password,
        callbackUrl: `${BASEURL}`
      });
      setCredentials(initialCredentials)
    } catch (error:any) {
      setError("Registration error!")
      setErrorToggle(true)
      setTimeout(() => {
        setErrorToggle(false)
        setError("")
      }, 3000)
    }
  }

  useEffect(() => {
    if (status === 'authenticated') {
      redirect(`${BASEURL}`)
    }
  }, [status])

  if (status === "loading")     return <div className="w-screen h-screen flex justify-center items-center"><Spinner /></div>

  if (error) return <div className="bg-black-75 w-screen h-screen flex justify-center items-center text-red-500 z-50">
  <p className="text-center text-red-500">{error}</p>
  <Error /></div>


  return (
    <div className="w-full h-screen flex justify-center items-center">
      <AuthForm type="Register" onSubmit={handleRegistration} />
    </div>
  );
}
