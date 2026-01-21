'use client';
import CONSTANT from "@/app/CONSTANT";
import Image from "next/image";
import React from "react";

interface profileProps {
    children: React.ReactNode;
}

export const SelectProfile = () => {
    const [imageSrc, setImageSrc] = React.useState<string>(CONSTANT.images.userDefault);


    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onload = (event) => {
                if (event.target && event.target.result) {
                    setImageSrc(event.target.result as string);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="flex flex-col gap-8 w-full justify-center items-center">
            <div>
                <div>
                    <input className="hidden" type="file" name="profilePicture" id="profilePicture" onChange={handleImageChange} />
                    <label htmlFor="profilePicture" className="hover:cursor-pointer">
                        <Image width={500} height={500} className="rounded-full object-cover p-2 size-40 border " src={imageSrc} alt="User Profile" />
                    </label>
                </div>
            </div>
        </div>
    )
}