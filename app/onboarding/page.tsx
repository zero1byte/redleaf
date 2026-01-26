'use client';
import { Form } from "@/components/onboarding/form";
import { SelectProfile } from "@/components/onboarding/selectProfile";
import { Input } from "@/components/onboarding/ui/input";
import { TextArea } from "@/components/onboarding/ui/textArea";
import { loggedUser } from "@/store/types";
import useAuthUserStore, { useUserStore } from "@/store/useUserStore";
import axios, { AxiosResponse } from "axios";
import { Github, Instagram, Linkedin, Loader2, Twitter } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";


// Upload avatar using API route (POST for new, handles upsert)
export const uploadAvatarUrl = async (file: File, userId: string): Promise<string | null> => {
    try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('userId', userId);

        const response = await axios.post('/api/user/avatar', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        if (response.data.isError) {
            console.error('Error uploading avatar:', response.data.error);
            return null;
        }

        return response.data.data?.url || null;
    } catch (error) {
        console.error('Error uploading avatar:', error);
        return null;
    }
}


export default function Page() {
    // Hydration fix - wait for client mount before using persisted store
    const [isMounted, setIsMounted] = useState(false);
    const [pageLoading, setPageLoading] = React.useState<boolean>(true);
    const [saving, setSaving] = React.useState<boolean>(false);
    const [saveMessage, setSaveMessage] = React.useState<{ type: 'success' | 'error', text: string } | null>(null);
    const [currentUser, setCurrentUser] = React.useState<loggedUser | null>(null);

    // Current user settings
    const [avatarUrl, setAvatarUrl] = React.useState<string | null>(null);
    const [NewAvatarUrl, setNewAvatarUrl] = React.useState<string | null>(null);
    const [avatarFile, setAvatarFile] = React.useState<File | null>(null);
    const [username, setUsername] = React.useState<string>('');
    const [fullName, setFullName] = React.useState<string>('');
    const [bio, setBio] = React.useState<string>('');
    const [socialMediaLinks, setSocialMediaLinks] = React.useState<{
        twitter: string;
        instagram: string;
        linkedin: string;
        github: string;
    }>({ twitter: '', instagram: '', linkedin: '', github: '' });

    const router = useRouter();
    // Only access store after mount to prevent hydration mismatch
    const user = useAuthUserStore((state) => state.user);
    const { setUser } = useUserStore();

    // Username validation states
    const [usernameStatus, setUsernameStatus] = React.useState<'idle' | 'checking' | 'available' | 'taken' | 'invalid'>('idle');
    const [usernameMessage, setUsernameMessage] = React.useState<string>('');
    const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const initialUsernameRef = useRef<string>('');
    // Handle hydration - only render after client mount
    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        if (!isMounted) return;
        if (!user || !user.id) {
            setPageLoading(false);
            return;
        }
        // Fetch current user data from Supabase or any other source
        (async () => {
            try {
                const { data } = await axios.get(`/api/user/${user.id}`) as AxiosResponse;
                setCurrentUser(data.data as loggedUser);
            } catch (error) {
                console.error('Error fetching user:', error);
            } finally {
                setPageLoading(false);
            }
        })();
    }, [user, isMounted]);

    useEffect(() => {
        if (currentUser) {
            setAvatarUrl(currentUser.avatar_url);
            setUsername(currentUser.username || '');
            setFullName(currentUser.full_name || '');
            setBio(currentUser.bio || '');
            // Parse social media links if stored as array of URLs
            const links = currentUser.social_media_linkes || [];
            setSocialMediaLinks({
                twitter: links.find((l: string) => l.includes('twitter')) || '',
                instagram: links.find((l: string) => l.includes('instagram')) || '',
                linkedin: links.find((l: string) => l.includes('linkedin')) || '',
                github: links.find((l: string) => l.includes('github')) || '',
            });
            initialUsernameRef.current = currentUser.username || ''; // Store initial username
        }
    }, [currentUser]);


    //check for username with debouncing
    useEffect(() => {
        // Clear previous timeout
        if (debounceTimeoutRef.current) {
            clearTimeout(debounceTimeoutRef.current);
        }

        // Skip if username is empty or same as initial
        if (!username) {
            setUsernameStatus('idle');
            setUsernameMessage('');
            return;
        }

        // Skip API call if username hasn't changed from initial
        if (username === initialUsernameRef.current) {
            setUsernameStatus('idle');
            setUsernameMessage('');
            return;
        }

        // Validate length
        if (username.length <= 4) {
            setUsernameStatus('invalid');
            setUsernameMessage('Username must be more than 4 characters');
            return;
        }
        //check for invalid characters(space
        const usernameRegex = /^[a-zA-Z0-9_]+$/;
        if (!usernameRegex.test(username)) {
            setUsernameStatus('invalid');
            setUsernameMessage('Username can only contain letters, numbers, and underscores');
            return;
        }

        // Set checking status
        setUsernameStatus('checking');
        setUsernameMessage('Checking availability...');

        // Debounce API call
        debounceTimeoutRef.current = setTimeout(async () => {
            try {
                const response = await axios.post('/api/user/check-username', { username }) as AxiosResponse;
                if (response.data.available) {
                    setUsernameStatus('available');
                    setUsernameMessage('Username is available!');
                } else {
                    setUsernameStatus('taken');
                    setUsernameMessage('Username is already taken');
                }
            } catch (error) {
                console.error('Error checking username availability:', error);
                setUsernameStatus('idle');
                setUsernameMessage('Error checking username');
            }
        }, 500); // 500ms debounce delay

        // Cleanup on unmount
        return () => {
            if (debounceTimeoutRef.current) {
                clearTimeout(debounceTimeoutRef.current);
            }
        };
    }, [username]);

    // Helper function to get status color
    const getStatusColor = () => {
        switch (usernameStatus) {
            case 'available': return 'text-chart-2';
            case 'taken':
            case 'invalid': return 'text-destructive';
            case 'checking': return 'text-chart-4';
            default: return 'text-muted-foreground';
        }
    };

    const getStatusBorderColor = () => {
        switch (usernameStatus) {
            case 'available': return 'border-chart-2';
            case 'taken':
            case 'invalid': return 'border-destructive';
            case 'checking': return 'border-chart-4';
            default: return 'border-border';
        }
    };

    // Handle avatar file selection
    const handleAvatarSelect = (file: File | null) => {
        setAvatarFile(file);
    };

    // Handle form submission
    const handleSaveProfile = async () => {
        if (!user?.id) {
            setSaveMessage({ type: 'error', text: 'User not authenticated' });
            return;
        }

        // Validate username
        if (usernameStatus === 'taken' || usernameStatus === 'invalid') {
            setSaveMessage({ type: 'error', text: 'Please fix the username before saving' });
            return;
        }

        if (!username || username.length <= 4) {
            setSaveMessage({ type: 'error', text: 'Username must be more than 4 characters' });
            return;
        }

        if (!fullName.trim()) {
            setSaveMessage({ type: 'error', text: 'Full name is required' });
            return;
        }

        setSaving(true);
        setSaveMessage(null);

        try {
            let finalAvatarUrl = avatarUrl;

            // Upload avatar if a new file was selected
            if (avatarFile && !NewAvatarUrl ) {
                const uploadedUrl = await uploadAvatarUrl(avatarFile, user.id);
                if (uploadedUrl) {
                    finalAvatarUrl = uploadedUrl;
                } else {
                    setSaveMessage({ type: 'error', text: 'Failed to upload avatar' });
                    setSaving(false);
                    return;
                }
            }

            // Collect social media links (filter out empty ones)
            const socialLinks = [
                socialMediaLinks.twitter,
                socialMediaLinks.instagram,
                socialMediaLinks.linkedin,
                socialMediaLinks.github,
            ].filter(link => link.trim() !== '');

            // Save profile data
            const response = await axios.put('/api/onboard/edit-profile', {
                username,
                full_name: fullName,
                bio,
                avatar_url: finalAvatarUrl,
                social_media_linkes: socialLinks,
            }) as AxiosResponse;

            if (response.data.isError) {
                setSaveMessage({ type: 'error', text: response.data.error || 'Failed to save profile' });
            } else {
                setSaveMessage({ type: 'success', text: 'Profile saved successfully!' });
                setAvatarUrl(finalAvatarUrl);
                setNewAvatarUrl(finalAvatarUrl);
                setAvatarFile(null);
                // Update initial username ref since it's now saved
                initialUsernameRef.current = username;
                //Reset storage state
                setUser(response.data.data);
                router.push('/');
                console.log('Profile saved:', response.data.data);
            }
        } catch (error: any) {
            console.error('Error saving profile:', error);
            setSaveMessage({
                type: 'error',
                text: error.response?.data?.error || 'Failed to save profile'
            });
        } finally {
            setSaving(false);
        }
    };

    // Show loading state until client is mounted and data is fetched
    if (!isMounted || pageLoading) {
        return (
            <div className="flex-1 w-full min-h-[60vh] flex flex-col items-center justify-center gap-4">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
                <p className="text-muted-foreground text-sm">Loading your profile...</p>
            </div>
        );
    }



    return (
        <div className="w-full">
            {/* Header Section */}
            <div className="mb-6 sm:mb-8">
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground">Complete Your Profile</h1>
                <p className="text-muted-foreground mt-1 sm:mt-2 text-xs sm:text-sm md:text-base">
                    Tell us more about yourself to get started
                </p>
            </div>

            <div className="bg-card border border-border rounded-lg shadow-sm overflow-hidden">
                <Form className="p-0">
                    {/* Profile Picture Section */}
                    <div className="p-4 sm:p-6 md:p-8 border-b border-border bg-muted/30">
                        <SelectProfile
                            avatar_url={avatarUrl}
                            onFileSelect={handleAvatarSelect}
                            selectedFile={avatarFile}
                        />
                    </div>

                    {/* Basic Info Section */}
                    <div className="p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-6">
                        <div className="space-y-1">
                            <h2 className="text-base sm:text-lg font-semibold text-foreground">Basic Information</h2>
                            <p className="text-xs sm:text-sm text-muted-foreground">Your account details</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                            {/* Username with validation */}
                            <div className="md:col-span-1">
                                <div className="flex flex-col gap-2">
                                    <label htmlFor="username" className="text-sm font-medium">Username</label>
                                    <div className="relative">
                                        <input
                                            onChange={(e) => setUsername(e.target.value)}
                                            type="text"
                                            name="username"
                                            id="username"
                                            placeholder={username || "Choose a username"}
                                            value={username}
                                            className={`w-full p-2.5 pr-10 border-2 rounded-md outline-none transition-colors ${getStatusBorderColor()} focus:ring-2 focus:ring-ring focus:ring-offset-1`}
                                        />
                                        {usernameStatus === 'checking' && (
                                            <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-chart-4" />
                                        )}
                                        {usernameStatus === 'available' && (
                                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-chart-2">✓</span>
                                        )}
                                        {(usernameStatus === 'taken' || usernameStatus === 'invalid') && (
                                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-destructive">✗</span>
                                        )}
                                    </div>
                                    {usernameMessage && (
                                        <span className={`text-xs sm:text-sm ${getStatusColor()} transition-colors`}>
                                            {usernameMessage}
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Full Name - Full width */}
                            <div className="md:col-span-2">
                                <Input
                                    label="Full Name"
                                    type="text"
                                    name="full_name"
                                    id="full_name"
                                    placeholder={fullName || "Enter your full name"}
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                />
                            </div>

                            {/* Bio - Full width */}
                            <div className="md:col-span-2">
                                <TextArea
                                    label="Bio"
                                    name="bio"
                                    id="bio"
                                    placeholder={bio || "Write a short bio about yourself..."}
                                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setBio(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Social Media Section */}
                    <div className="p-4 sm:p-6 md:p-8 border-t border-border bg-muted/20">
                        <div className="space-y-1 mb-4 sm:mb-6">
                            <h2 className="text-base sm:text-lg font-semibold text-foreground">Social Links</h2>
                            <p className="text-xs sm:text-sm text-muted-foreground">Connect your social media profiles (optional)</p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                            {/* Twitter */}
                            <div className="flex items-center gap-2 sm:gap-3">
                                <div className="flex-shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-md bg-background border border-border flex items-center justify-center">
                                    <Twitter className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                                </div>
                                <input
                                    type="text"
                                    name="twitter"
                                    id="twitter"
                                    placeholder="twitter.com/username"
                                    value={socialMediaLinks.twitter}
                                    onChange={(e) => setSocialMediaLinks(prev => ({ ...prev, twitter: e.target.value }))}
                                    className="flex-1 min-w-0 p-2 sm:p-2.5 border-2 border-border rounded-md outline-none focus:border-primary transition text-xs sm:text-sm"
                                />
                            </div>

                            {/* Instagram */}
                            <div className="flex items-center gap-2 sm:gap-3">
                                <div className="flex-shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-md bg-background border border-border flex items-center justify-center">
                                    <Instagram className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                                </div>
                                <input
                                    type="text"
                                    name="instagram"
                                    id="instagram"
                                    placeholder="instagram.com/username"
                                    value={socialMediaLinks.instagram}
                                    onChange={(e) => setSocialMediaLinks(prev => ({ ...prev, instagram: e.target.value }))}
                                    className="flex-1 min-w-0 p-2 sm:p-2.5 border-2 border-border rounded-md outline-none focus:border-primary transition text-xs sm:text-sm"
                                />
                            </div>

                            {/* LinkedIn */}
                            <div className="flex items-center gap-2 sm:gap-3">
                                <div className="flex-shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-md bg-background border border-border flex items-center justify-center">
                                    <Linkedin className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                                </div>
                                <input
                                    type="text"
                                    name="linkedin"
                                    id="linkedin"
                                    placeholder="linkedin.com/in/username"
                                    value={socialMediaLinks.linkedin}
                                    onChange={(e) => setSocialMediaLinks(prev => ({ ...prev, linkedin: e.target.value }))}
                                    className="flex-1 min-w-0 p-2 sm:p-2.5 border-2 border-border rounded-md outline-none focus:border-primary transition text-xs sm:text-sm"
                                />
                            </div>

                            {/* GitHub */}
                            <div className="flex items-center gap-2 sm:gap-3">
                                <div className="flex-shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-md bg-background border border-border flex items-center justify-center">
                                    <Github className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                                </div>
                                <input
                                    type="text"
                                    name="github"
                                    id="github"
                                    placeholder="github.com/username"
                                    value={socialMediaLinks.github}
                                    onChange={(e) => setSocialMediaLinks(prev => ({ ...prev, github: e.target.value }))}
                                    className="flex-1 min-w-0 p-2 sm:p-2.5 border-2 border-border rounded-md outline-none focus:border-primary transition text-xs sm:text-sm"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Submit Section */}
                    <div className="p-4 sm:p-6 md:p-8 border-t border-border bg-card">
                        {/* Save Message */}
                        {saveMessage && (
                            <div className={`mb-4 p-3 rounded-md text-sm ${saveMessage.type === 'success'
                                ? 'bg-chart-2/10 text-chart-2 border border-chart-2/30'
                                : 'bg-destructive/10 text-destructive border border-destructive/30'
                                }`}>
                                {saveMessage.text}
                            </div>
                        )}
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
                            <p className="text-xs sm:text-sm text-muted-foreground text-center sm:text-left">
                                You can always update your profile later
                            </p>
                            <button
                                type="button"
                                onClick={handleSaveProfile}
                                disabled={saving || usernameStatus === 'checking'}
                                className="w-full sm:w-auto min-w-[120px] sm:min-w-[150px] py-2 sm:py-2.5 px-4 text-sm font-medium bg-secondary-foreground text-white rounded-md hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                                {saving ? 'Saving...' : 'Save Profile'}
                            </button>
                        </div>
                    </div>
                </Form>
            </div>
        </div>
    )
}