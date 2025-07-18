import { ProfileUpdateRequest, ProfileUpdateResponse, User } from '../../types/auth.types';
import { authApi } from '../api';

/**
 * Update user profile
 * @param token - Authentication token (not needed as it's handled by authApi)
 * @param data - Profile data to update
 * @returns Promise with updated user data
 */
export const updateUserProfile = async (
  _token: string,
  data: ProfileUpdateRequest
): Promise<ProfileUpdateResponse> => {
  try {
    // Create JSON payload
    const payload = {
      username: data.username,
      email: data.email,
      favoriteDriver: data.favoriteDriver,
      favoriteTeam: data.favoriteTeam,
      profilePicture: data.profilePicture // Can be File or string URL
    };

    // Remove undefined fields from payload
   

    // Make the API call with JSON payload
    const user = await authApi.put<User>(`/user/${data.email}`, payload,true);

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
 * Update user profile by email
 * @param _token - Authentication token (not needed as it's handled by authApi)
 * @param email - User email address
 * @param data - Profile data to update
 * @returns Promise with updated user data
 */