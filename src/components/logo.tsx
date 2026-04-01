import React from "react"
import { Play } from "lucide-react"

export const Logo = () => {
    return (
        <div className="flex items-center gap-2">
            <div className="bg-rose-600 text-white p-1.5 rounded-lg shadow-sm">
                <Play size={12} className="fill-current ml-0.5" />
            </div>
            <span className="font-bold text-[17px] tracking-tight text-slate-900 leading-none">
                SaaSVideo
            </span>
        </div>
    )
}
