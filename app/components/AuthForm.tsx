"use client";
import { useAtom } from "jotai";
import { credentialsAtom } from "../context/Atoms";
import { FormEventHandler } from "react";

export default function AuthForm({
  onSubmit,
  type,
}: {
  onSubmit: FormEventHandler<HTMLFormElement>;
  type: "Login" | "Register";
}) {
  const [credentials, setCredentials] = useAtom(credentialsAtom);

  return (
    <form
      onSubmit={onSubmit}
      className="flex flex-col justify-center items-center gap-12 w-full h-full p-1"
    >
      <h2 className="text-2xl">{type}</h2>
      <div className="flex flex-col w-1/2 gap-2">
        <label htmlFor="username">Username:</label>
        <input
          id="username"
          type="text"
          value={credentials.username}
          onChange={(e) =>
            setCredentials({ ...credentials, username: e.target.value })
          }
          className="bg-white p-1 border-none ring-2 rounded-sm"
          min={8}
          max={16}
          autoComplete="true"
        />
      </div>
      <div className="flex flex-col w-1/2 gap-2">
        <label htmlFor="password">Password:</label>
        <input
          id="password"
          type="password"
          value={credentials.password}
          onChange={(e) =>
            setCredentials({ ...credentials, password: e.target.value })
          }
          className="bg-white p-1 border-none ring-2 rounded-sm"
          autoComplete="true"
        />
      </div>
      <button type="submit" className="bg-emerald-300 h-12 w-60 hover:bg-red-400 duration-200 ease-in-out text-white rounded-lg">
        Submit
      </button>
    </form>
  );
}
