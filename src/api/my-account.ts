import useSWR from 'swr';
import axios from 'axios';
import { useMemo } from 'react';

import { endpoints } from 'src/utils/axios';
import { HOST_API } from 'src/config-global';

// Fetcher function for useSWR
const fetcher = (url: string) => axios.get(url).then((res) => res.data);

// Endpoint configuration

// Custom hook to fetch user data
export function useMyAccountUser(userId: string) {
  const URL = `${HOST_API}/${endpoints.my_account.details}/${userId}`;

  const { data, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      myUser: data?.profile || null,
      userLoading: !data && !error,
      userError: error,
      userValidating: isValidating,
      userEmpty: !data && !error && !isValidating,
    }),
    [data, error, isValidating]
  );

  return memoizedValue;
}

export function useMyAccountProfilePhoto(userId: string) {
  const URL = `${HOST_API}/${endpoints.my_account.getProfilePhoto}/${userId}`;

  const { data, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      myProfilePhoto: data && data.length > 0 ? data[0].image : null,
      userLoading: !data && !error,
      userError: error,
      userValidating: isValidating,
      userEmpty: !data && !error && !isValidating,
    }),
    [data, error, isValidating]
  );

  return memoizedValue;
}

export async function createProfilePhoto(imageUrl: string, userId: string) {
  const URL = `${HOST_API}/api/createProfilePhoto`;

  try {
    const response = await fetch(URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, image: imageUrl }),
    });

    if (!response.ok) {
      throw new Error('Failed to create profile photo');
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating profile photo:', error);
    throw error;
  }
}

export const fetchProfilePhoto = async (userId: string): Promise<string | null> => {
  try {
    const response = await axios.get(
      `${HOST_API}/api/getProfilePhoto/${userId}`
    );

    return response.data?.[0]?.image || null; // Replace `photoUrl` with the field containing the photo URL in your schema
  } catch (error) {
    console.error('Error fetching profile photo:', error);
    return null;
  }
};

export const updateProfilePhoto = async (userId: string, imageUrl: string): Promise<boolean> => {
  try {
    const response = await axios.post(
      `${HOST_API}/api/editProfilePhoto/${userId}`,
      {
        image: imageUrl,
      }
    );

    console.log(response.data, 'Profile photo updated successfully');
    return true;
  } catch (error) {
    console.error('Error updating profile photo:', error);
    return false;
  }
};

export const getProfileDetails = async (userId: string): Promise<any | null> => {
  try {
    const response = await axios.get(`${HOST_API}/api/getProfile/${userId}`);

    console.log(response.data, 'Profile details fetched successfully');
    return response.data.profile; // Assuming the backend sends profile details under 'profile'
  } catch (error) {
    console.error('Error fetching profile details:', error);
    return null;
  }
};

export const createProfile = async (profileData: any) => {
  try {
    const response = await axios.post(
      `${HOST_API}/api/createProfile`,
      profileData
    );
    console.log('Profile created successfully', response.data);
    return response.data.profile;
  } catch (error) {
    console.error('Error creating profile:', error?.response?.data?.message || error.message);
    return null;
  }
};

// Update Profile
export const updateProfile = async (
  userId: string,
  profileData: {
    username?: string;
    birthday?: string;
    gender?: string;
    status?: string;
    zipCode?: string;
    city?: string;
    email?: string;
    country?: string;
    state?: string;
    address: string;
    avatarUrl?: string;
    phoneNumber?: string;
    isVerified?: boolean;
  }
): Promise<any | null> => {
  try {
    const response = await axios.post(
      `${HOST_API}/api/updateProfile/${userId}`,
      profileData
    );
    console.log(response.data, 'Profile updated successfully');
    return response.data.profile;
  } catch (error) {
    console.error('Error updating profile:', error);
    return null;
  }
};
