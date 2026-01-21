'use client';
import { Form } from "@/components/onboarding/form";
import { SelectProfile } from "@/components/onboarding/selectProfile";
import { Button } from "@/components/onboarding/ui/formButton";
import { Input } from "@/components/onboarding/ui/input";
import { TextArea } from "@/components/onboarding/ui/textArea";
import axios, { AxiosResponse } from "axios";
import React, { useEffect } from "react";



export default function Page() {

    const [currentUser, setCurrentUser] = React.useState<any>(null);

    useEffect(() => {
        // Fetch current user data from Supabase or any other source
        (async()=>{
            // const { data: { user }, error } = await supabase.auth.getUser();
            // console.log("Current User",user);
            
            const {data}=await axios.get('/api/me') as AxiosResponse;
            console.log(data);
            // setCurrentUser(data);
        })();
    }, []);

    return (
        <div className="flex-1 w-full flex flex-col gap-12">
            <div>
                <Form>
                    <SelectProfile></SelectProfile>
                    <Input label="Username" type="text" name="name" id="name" placeholder="Name"></Input>
                    <Input label="Full Name" type="text" name="full_name" id="full_name" placeholder="Full Name"></Input>
                    <TextArea label="Bio" name="bio" id="bio" placeholder="Write a short bio about yourself..."></TextArea>
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