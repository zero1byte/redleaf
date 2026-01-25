import { createClient } from "./server"

export const createAvatarBucket = async () => {
    // Function to create an avatar bucket in Supabase Storage
    const supabase = await createClient()
    const { data, error } = await supabase.storage.createBucket('avatars_users', {
        public: true,
        allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
        fileSizeLimit: 20 * 1024 * 1024, // 20MB
    })
    console.log('Avatar bucket creation data:', data)
    if (error) {
        console.error('Error creating avatar bucket:', error)
    }
}