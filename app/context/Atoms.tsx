import { atom } from "jotai";

export type TItem = {
  id?:string
  name: string;
  quantity: number ;
  price: number ;
};

export type TCredentials = {
  email?: string;
  username: string;
  password: string;
};
export const initialCredentials = {
  username: "",
  password: "",
};
export const credentialsAtom = atom(initialCredentials);
export const mobileToggleAtom = atom(false);
export const searchTermAtom = atom("")
export const searchListAtom = atom<any[]>([])
export const catalogAtom = atom<TItem[]>([]);
export const errorAtom = atom<string>("")
export const errorToggleAtom = atom<boolean>(false)

