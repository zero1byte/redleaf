'use client';
import { UserRound, Upload, X } from "lucide-react";
import Image from "next/image";
import React from "react";

interface SelectProfileProps {
    avatar_url?: string | null;
    onFileSelect?: (file: File | null) => void;
    selectedFile?: File | null;
}

export const SelectProfile = ({ avatar_url, onFileSelect, selectedFile }: SelectProfileProps) => {
    const [imageSrc, setImageSrc] = React.useState<string>('');

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
            // Pass the file to parent component
            onFileSelect?.(file);
        }
    };

    const handleRemoveImage = () => {
        setImageSrc('');
        onFileSelect?.(null);
    };

    const displayImage = imageSrc || avatar_url;

    return (
        <div className="flex flex-col gap-4 w-full justify-center items-center">
            <div className="relative">
                <input 
                    className="hidden" 
                    type="file" 
                    name="profilePicture" 
                    id="profilePicture" 
                    accept="image/*"
                    onChange={handleImageChange} 
                />
                <label htmlFor="profilePicture" className="hover:cursor-pointer block">
                    {displayImage ? (
                        <div className="relative group">
                            <Image
                                width={500}
                                height={500}
                                className="rounded-full object-cover p-1 size-24 sm:size-32 border-2 border-border"
                                src={displayImage}
                                alt="User Profile"
                            />
                            <div className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <Upload className="h-6 w-6 text-white" />
                            </div>
                        </div>
                    ) : (
                        <div className="border-2 border-dashed border-border p-1 rounded-full hover:border-primary transition-colors">
                            <UserRound className="bg-muted rounded-full p-2 size-24 sm:size-32 text-muted-foreground" />
                        </div>
                    )}
                </label>
                {/* Remove button when there's a new selected image */}
                {imageSrc && (
                    <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground rounded-full p-1 hover:opacity-80 transition-opacity"
                    >
                        <X className="h-4 w-4" />
                    </button>
                )}
            </div>
            <div className="text-center">
                <p className="text-sm font-medium text-foreground">Profile Picture</p>
                <p className="text-xs text-muted-foreground mt-1">
                    {selectedFile ? selectedFile.name : 'Click to upload'}
                </p>
            </div>
        </div>
    )
}