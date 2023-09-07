'use client'

import { mobileToggleAtom } from "@/app/context/Atoms"
import { useAtom } from "jotai"

export default function Hamburger() {
    const [mobileToggle, setMobileToggle] = useAtom(mobileToggleAtom)

    function handleMobileToggle() {
        setMobileToggle(prev => !prev)
    }

    return (
        <div className="absolute top-5 right-2 md:hidden cursor-pointer space-y-2 border border-black px-1 py-2 z-50 bg-white rounded-md" onClick={handleMobileToggle}>
            <div className="w-8 h-0.5 bg-gray-600"></div>
            <div className="w-8 h-0.5 bg-gray-600"></div>
            <div className="w-8 h-0.5 bg-gray-600"></div>
        </div>
    )
}
