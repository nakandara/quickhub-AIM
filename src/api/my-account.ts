import useSWR from 'swr';
import axios from 'axios';
import { useMemo } from 'react';

import { endpoints } from 'src/utils/axios';

// Fetcher function for useSWR
const fetcher = (url: string) => axios.get(url).then((res) => res.data);

// Endpoint configuration

// Custom hook to fetch user data
export function useMyAccountUser(userId: string) {

  const URL = `https://worldadd-api.vercel.app/${endpoints.my_account.details}/${userId}`;

  
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
    const URL = `https://worldadd-api.vercel.app/${endpoints.my_account.getProfilePhoto}/${userId}`;
  
   
  
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
    const URL = 'https://worldadd-api.vercel.app/api/createProfilePhoto';
  
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
      const response = await axios.get(`https://worldadd-api.vercel.app/api/getProfilePhoto/${userId}`);
    
      
      return response.data?.[0]?.image || null; // Replace `photoUrl` with the field containing the photo URL in your schema
    } catch (error) {
      console.error('Error fetching profile photo:', error);
      return null;
    }
  };
  

  export const updateProfilePhoto = async (userId: string, imageUrl: string): Promise<boolean> => {
    try {
      const response = await axios.post(`https://worldadd-api.vercel.app/api/editProfilePhoto/${userId}`, {
        image: imageUrl,
      });
  
      console.log(response.data, 'Profile photo updated successfully');
      return true;
    } catch (error) {
      console.error('Error updating profile photo:', error);
      return false;
    }
  };