'use client';
import { Form } from "@/components/onboarding/form";
import { SelectProfile } from "@/components/onboarding/selectProfile";
import { Button } from "@/components/onboarding/ui/formButton";
import { Input } from "@/components/onboarding/ui/input";
import { TextArea } from "@/components/onboarding/ui/textArea";
import { loggedUser } from "@/store/types";
import useAuthUserStore from "@/store/useUserStore";
import axios, { AxiosResponse } from "axios";
import React, { useEffect } from "react";



export default function Page() {
    const [pageLoading, setPageLoading] = React.useState<boolean>(true);
    const [currentUser, setCurrentUser] = React.useState<loggedUser | null>(null);
    //Current user settings
    const [email, setEmail] = React.useState<string>('');
    const [avatarUrl, setAvatarUrl] = React.useState<string | null>(null);
    const [username, setUsername] = React.useState<string>('');
    const [fullName, setFullName] = React.useState<string>('');
    const [bio, setBio] = React.useState<string>('');
    const [socialMediaLinks, setSocialMediaLinks] = React.useState<string[]>([]);
    const { user } = useAuthUserStore();

    useEffect(() => {
        if (!user) return;
        // Fetch current user data from Supabase or any other source
        (async () => {
            const { data } = await axios.get(`/api/user/${user.id}`) as AxiosResponse;
            setCurrentUser(data.data as loggedUser);
            setPageLoading(false);
        })();
    }, [user]);

    useEffect(() => {
        if (currentUser) {
            setEmail(currentUser.email);
            setAvatarUrl(currentUser.avatar_url);
            setUsername(currentUser.username);
            setFullName(currentUser.name);
            setBio(currentUser.description || '');
            setSocialMediaLinks(currentUser.social_media_links || []);
        }
    }, [currentUser]);

    if (pageLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="flex-1 w-full flex flex-col gap-12 bg-card p-8 md:p-16 lg:p-10 rounded-sm">
            <div>
                <Form>
                    <SelectProfile avatar_url={avatarUrl}></SelectProfile>
                    <Input disabled label="Email" type="text" name="email" id="email" placeholder={email}></Input>
                    <Input label="Username" type="text" name="name" id="name" placeholder={username || "Username"}></Input>
                    <Input label="Full Name" type="text" name="full_name" id="full_name" placeholder={fullName || "Full name"}></Input>
                    <TextArea label="Bio" name="bio" id="bio" placeholder={bio || "Bio"}></TextArea>
                    <hr className="border-border" />
                    <div className="flex flex-col gap-2">
                        <label htmlFor="">Social Media</label>
                        <Input type="text" name="twitter" id="twitter" placeholder="Twitter"></Input>
                        <Input type="text" name="instagram" id="instagram" placeholder="Instagram"></Input>
                        <Input type="text" name="linkedin" id="linkedin" placeholder="LinkedIn"></Input>
                        <Input type="text" name="github" id="github" placeholder="GitHub"></Input>
                    </div>
                    <div className="w-full flex items-end justify-end py-5">
                        <Button type={true} className="w-full">Submit</Button>
                    </div>
                </Form>
            </div>
        </div>
    )
}