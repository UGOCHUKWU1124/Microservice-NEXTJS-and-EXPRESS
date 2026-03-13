import { Plus } from 'lucide-react';
import { useState } from 'react';
import { Controller } from 'react-hook-form';

// Default colours array
export const defaultColours = [
  "#000000", // Black
  "#FF5733", // Red-Orange
  "#33C1FF", // Blue
  "#75FF33", // Green
  "#FF33A8", // Pink
  "#FFFFFF", // White
  "#ffff00", // Yellow
  "#ff0000", // Red
];

const CololorSelector = ({ control, errors }: any) => {
    const [customColors, setCustomColors] = useState<string[]>([]);
    const [showColorPicker, setShowColorPicker] = useState(false);
    const [newColor, setNewColors] = useState("#ffffff");

    return (
        <div className="mt-2">
            <label className="block mb-2 font-semibold text-gray-300 dark:text-white">
                Colours
            </label>
            <Controller name='colors'
            control={control}
            render={({field}) => (
                <div className='flex gap-3 flex-wrap'>
                    {[...defaultColours, ...customColors].map((color) =>  {
                        const isSelected = (field.value || []).includes(color);
                        const isLightColor = ["#ffffff", "#ffff00"].includes(color);

                        return (
                            <button onClick={() => field.onChange(isSelected ? field.value.filter((c:string) => c === color) : [...(field.value || []), color])} type='button' key={color} className= {`w-7 h-7 p-2 rounded-md my-1 flex items-center justify-center border-2 transition ${isSelected ? "scale-110 border-white" : "border-transparent" } ${isLightColor ? "border-gray-600" : " "} `} style={{backgroundColor: color}} />
                        )
                    })}
                    {/* add new color  */}
                    <button type='button' className="w-8 h-8 flex items-center justify-center rounded-full border-2 border-gray-500 bg-gray-800 hover:bg-gray-700 transition">
                        <Plus size={16} color='white' onClick={() => setShowColorPicker(true)}/>
                    </button>

                    {/* color picker  */}
                    {showColorPicker && (
                        <div className="relative flex items-center gap-2 ">
                        <input type="color" value={newColor} onChange={(e) => setNewColors(e.target.value)} className="w-10 h-10 p-0 border-none cursor-pointer" />

                        <button type='button' onClick={() => {
                            setCustomColors([...customColors, newColor]);
                            setShowColorPicker(false);
                        }} className="px-3 py-1 bg-gray-700 text-white rounded-md text-sm">
                            Add
                        </button>
                    </div>
                    )}
                </div>
            )}/>
        </div>
    )
};

export default CololorSelector;