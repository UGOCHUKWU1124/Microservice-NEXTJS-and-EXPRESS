    import React from "react";
    import { Controller, useFieldArray } from "react-hook-form";
import Input from '../input';

    const CustomSpecifications = ({ control, errors }: any) => {
    const { fields, append, remove } = useFieldArray({
        control,
        name: "custom_specifications",
    });
    return (
        <div>
        <label className="block mb-2 font-semibold text-gray-300">
            Custom Specifications
        </label>
        <div className="flex flex-col gap-3">
            {fields.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                    <Controller
                        name={`custom_specifications.${index}.name`}
                        control={control}
                        rules={{required: "Specificatiom name is required"}}
                        render={({ field }) => (
                            <Input
                                label= "Specification Name"
                                placeholder="E.g Color, Storage, Weight, Material"
                                {...field}
                            />
                        )}
                    />  
                </div>
            ))}
        </div>
        </div>
    );
    };

    export default CustomSpecifications;
