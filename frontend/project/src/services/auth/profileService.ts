import { ProfileUpdateRequest, ProfileUpdateResponse, User } from '../../types/auth.types';
import { authApi } from '../api';

/**
 * Update user profile
 * @param token - Authentication token (not needed as it's handled by authApi)
 * @param data - Profile data to update
 * @returns Promise with updated user data
 */
const convertFileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

export const updateUserProfile = async (
  _token: string,
  data: ProfileUpdateRequest
): Promise<ProfileUpdateResponse> => {
  try {
    let profilePictureBase64 = data.profilePicture;
    if (data.profilePicture instanceof File) {
      profilePictureBase64 = await convertFileToBase64(data.profilePicture);
    }

    // Handle cover photo if present (even if strictly typed DTO might ignore it, we convert to be safe)
    let coverPhotoBase64 = (data as any).coverPhoto;
    if ((data as any).coverPhoto instanceof File) {
      coverPhotoBase64 = await convertFileToBase64((data as any).coverPhoto);
    }

    // Create JSON payload
    const payload = {
      username: data.username,
      email: data.email,
      favoriteDriver: data.favoriteDriver,
      favoriteTeam: data.favoriteTeam,
      profilePicture: profilePictureBase64, // Now guaranteed to be string or undefined
      // bio: (data as any).bio, // Optional: Include if you want to try sending it
      // location: (data as any).location,
      // coverPhoto: coverPhotoBase64 
    };

    // Only add extra fields if they are defined to keep payload clean
    if ((data as any).bio) (payload as any).bio = (data as any).bio;
    if ((data as any).location) (payload as any).location = (data as any).location;
    if (coverPhotoBase64) (payload as any).coverPhoto = coverPhotoBase64;

    // Make the API call with JSON payload
    // Note: This relies on the backend accepting a specific encoding or just a long string
    const user = await authApi.put<User>(`/user/${data.email}`, payload, true);

    return {
      user,
      message: 'Profile updated successfully'
    };
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};

/**
 * Upload profile picture
 * @param token - Authentication token
 * @param file - Image file to upload
 * @returns Promise with the URL of the uploaded image
 */
/**
 * Fetch user profile by email
 * @param token - Authentication token
 * @param email - User email address
 * @returns Promise with user data
 */
/**
 * Fetch user profile by email
 * @param _token - Authentication token (not needed as it's handled by authApi)
 * @param email - User email address
 * @returns Promise with user data
 */
export const fetchUserProfile = async (_token: string, email: string): Promise<User> => {
  try {
    return await authApi.get<User>(`/user/${email}`);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
};

/**
 * Fetch current user profile using the token
 * @returns Promise with user data
 */
export const getCurrentUser = async (): Promise<User> => {
  try {
    return await authApi.get<User>('/user');
  } catch (error) {
    console.error('Error fetching current user:', error);
    throw error;
  }
};

/**
 * Update user profile by email
 * @param _token - Authentication token (not needed as it's handled by authApi)
 * @param email - User email address
 * @param data - Profile data to update
 * @returns Promise with updated user data
 */