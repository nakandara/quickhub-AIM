import useSWR from 'swr';
import { useMemo } from 'react';

import axios, { fetcher, endpoints } from 'src/utils/axios';

import { HOST_API } from 'src/config-global';
import { IPostItem } from 'src/types/blog';

// Types
export type PostImage = {
  imageUrl: string;
  _id: string;
};

export type Post = {
  _id: string;
  userId: string;
  brand: string;
  yearOfManufacture: string;
  mileage: string;
  engineCapacity: string;
  fuelType: string[];
  transmission: string[];
  bodyType: string;
  category: string[];
  images: PostImage[];
  negotiable: boolean;
  description: string;
  title: string;
  city: string;
  mobileNumber: string;
  whatsappNumber: string;
  price: string;
  socialIcon: string[];
  verify: boolean;
  condition: string;
  tags: string[];
  postId: string;
  createdAt: string;
  updatedAt: string;
};

export type PostsResponse = {
  success: boolean;
  message: string;
  data: Post[];
};

export function useGetLatestPosts(title: string) {
    const URL = title ? [endpoints.post.latest, { params: { title } }] : '';
  
    const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);
  
    const memoizedValue = useMemo(
      () => ({
        latestPosts: (data?.latestPosts as IPostItem[]) || [],
        latestPostsLoading: isLoading,
        latestPostsError: error,
        latestPostsValidating: isValidating,
        latestPostsEmpty: !isLoading && !data?.latestPosts.length,
      }),
      [data?.latestPosts, error, isLoading, isValidating]
    );
  
    return memoizedValue;
  }

  export function useGetVerifiedPosts() {
    const URL = `${HOST_API}/api/getVerifyAllPosts`;
    const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);
  
    const memoizedValue = useMemo(
      () => ({
        verifiedPosts: (data?.data || []), // Extract posts from data
        verifiedPostsLoading: isLoading,
        verifiedPostsError: error,
        verifiedPostsValidating: isValidating,
        verifiedPostsEmpty: !isLoading && data?.data.length === 0,
      }),
      [data, error, isLoading, isValidating]
    );
  
    return memoizedValue;
  }

  export async function createPost(postData: Record<string, any>) {
    const URL = `${HOST_API}/api/createPost`; 
    const formData = new FormData();
  
    // Iterate over postData entries
    Object.entries(postData).forEach(([key, value]) => {
      if (key === "images") {
        // Append multiple images under the field name 'image'
        (value as Array<string | Blob>).forEach((url) => formData.append("image", url));
      } else {
        formData.append(key, value);
      }
    });
  
    try {
      const response = await axios.post(URL, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
  
      // Return response as expected
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error("Error creating post:", error);
  
      // Return error with detailed message
      return {
        success: false,
        error: error.response?.data?.message || error.message,
      };
    }
  }

  export async function deletePost(userId: string, postId: string) {
    const URL = `${HOST_API}/api/deletePost/${userId}/${postId}`;
  
    try {
      const response = await axios.delete(URL);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('Error deleting post:', error);
      return {
        success: false,
        error: error.response?.data?.message || error.message,
      };
    }
  }
  
  export function useGetUserPosts(userId: string) {
    const URL = `${HOST_API}/api/getPosts/${userId}`;
    
    const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);
    console.log(data, 'Raw data from API');
  
    // Simplify the data transformation
    const userPosts = useMemo(() => {
      if (!data) return [];
      // If data is already an array, return it
      if (Array.isArray(data)) return data;
      // If data is a single object, wrap it in an array
      if (typeof data === 'object' && data !== null) return [data];
      return [];
    }, [data]);
  
    console.log(userPosts, 'Transformed user posts');
  
    return {
      userPosts,
      userPostsLoading: isLoading,
      userPostsError: error,
      userPostsValidating: isValidating,
      userPostsEmpty: !isLoading && userPosts.length === 0,
    };
  }

  export async function editPost(postId: string, postData: Record<string, any>) {
    const URL = `${HOST_API}/api/editPost/${postId}`;
  
    try {
      const response = await axios.put(URL, postData);
      return {
        success: true,
        data: response.data,
      };
    } catch (error: any) {
      console.error('Error editing post:', error);
      return {
        success: false,
        error: error.response?.data?.message || error.message,
      };
    }
  }

  export async function getAllPosts() {
    try {
      const response = await axios.get<PostsResponse>(`${HOST_API}/api/getAllPosts`);
      return response.data;
    } catch (error) {
      console.error('Error fetching posts:', error);
      throw error;
    }
  }