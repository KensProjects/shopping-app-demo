'use client'

import { errorAtom, errorToggleAtom } from "../context/Atoms"
import { useAtom } from "jotai"

export default function Error() {
    const [error] = useAtom(errorAtom)
    const [errorToggle] = useAtom(errorToggleAtom)

    if (!errorToggle) return null

    return (
        <p className="text-center text-red-500">{error}</p>
    )
}
