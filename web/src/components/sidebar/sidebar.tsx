import { File, FileWarning } from "lucide-react";
import { ReactElement } from "react";

export default function Sidebar({options, selectedOption} : {options: {id: string, name: string, icon: ReactElement}[], selectedOption: (option: string) => void}) {
    return (
        <div className="flex flex-col gap-2 h-full items-center py-2 w-16 rounded-tl-md rounded-bl-md border-r-1 border-secondary">
            {options.map((option) => (
                <div onClick={()=>selectedOption(option.id)} className="flex flex-col items-center w-12 h-12 justify-center cursor-pointer hover:bg-secondary rounded-md transition-colors duration-200 relative group">
                    {option.icon}
                    <div className="z-10 absolute left-16 top-1/2 transform -translate-y-1/2 select-none pointer-events-none opacity-0 group-hover:opacity-100 bg-secondary text-xs rounded-md px-2 py-1 transition-opacity duration-200">
                        {option.name}
                    </div>
                </div>
            ))}
        </div>
    )
}