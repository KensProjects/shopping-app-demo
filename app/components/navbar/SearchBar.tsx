"use client";

import { useAtom } from "jotai";
import {
  catalogAtom,
  errorAtom,
  errorToggleAtom,
  searchListAtom,
  searchTermAtom
} from "@/app/context/Atoms";
import { ItemList } from "@/app/utils/ItemList";
import { FormEvent, useEffect } from "react";
import { redirect } from "next/navigation";
import Image from "next/image";

export default function SearchBar() {
  const [searchTerm, setSearchTerm] = useAtom(searchTermAtom);
  const [catalog, setCatalog] = useAtom(catalogAtom);
  const [searchList, setSearchList] = useAtom(searchListAtom)
  const [error, setError] = useAtom(errorAtom)
  const [errorToggle, setErrorToggle] = useAtom(errorToggleAtom)


  async function handleSearch(e: FormEvent) {
    e.preventDefault();
    try {
      const existingItem = localStorage.getItem('searchItem')
      if (existingItem) {
        localStorage.clear()
      }
      localStorage.setItem("searchItem", searchTerm.toLowerCase())
      setCatalog(
        ItemList.filter((item) =>
          item.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
      redirect(`/catalog?item=${searchTerm.toLowerCase()}`);
    } catch (error:any) {
      setError(error)
      setErrorToggle(true)
      setTimeout(() => {
        setErrorToggle(false)
        setError("")
      }, 3000)
    }
    return;
  }
  async function handleSearchListOnClick(searchListItem: string) {
    try {
      const existingItem = localStorage.getItem('searchItem')
      if (existingItem) {
        localStorage.clear()
      }
      localStorage.setItem("searchItem", searchListItem.toLowerCase())

      setCatalog(
        ItemList.filter((item) =>
          item.name.toLowerCase().includes(searchListItem.toLowerCase())
        )
      );
      redirect(`/catalog?item=${searchListItem.toLowerCase()}`);
    } catch (error:any) {
      setError(error)
      setErrorToggle(true)
      setTimeout(() => {
        setErrorToggle(false)
        setError("")
      }, 3000)
    }
  }
  useEffect(() => {
    if (!searchTerm) {
      setSearchList([]);
    } else {
      setSearchList(
        ItemList.filter((item) =>
          item.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  }, [searchTerm]);

  return (
    <div className="flex flex-col justify-center items-start relative">
      <form
        onSubmit={handleSearch}
        className="flex flex-col border border-black h-auto rounded-lg bg-white w-fit overflow-hidden px-1 text-black"
      >
        <div className="text-center h-9 flex justify-center items-center">
          <input
            type="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="text-gray-400 p-1 relative outline-none focus:outline-none h-full border-r border-gray-400"
          />
          <button type="submit" className="h-full w-fit px-1.5 ">
            <Image src="/Magnifying_glass_icon.svg" alt="img" width={18} height={18} />
          </button>
        </div>



      </form>
      <ul className="absolute top-16 bg-white text-black w-56 z-40">
        {searchList.map((item) => {
          return (
            <li
              className="cursor-pointer border border-black w-auto p-1 hover:bg-gray-100 duration-100 ease-in-out"
              key={item.name}
              onClick={() => handleSearchListOnClick(item.name)}
            >
              {item.name}
            </li>
          );
        })}
      </ul>
    </div>

  );
}
