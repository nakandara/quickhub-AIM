import useSWR from 'swr';
import { useMemo } from 'react';

import axios, { fetcher, endpoints } from 'src/utils/axios';

import { HOST_API } from 'src/config-global';
import { IPostItem } from 'src/types/blog';




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
    
    const URL = userId ? `${HOST_API}/api/getPosts/${userId}` : null;
  
    const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  
    const memoizedValue = useMemo(
      () => ({
        userPosts: (data || []) as IPostItem[],
        userPostsLoading: isLoading,
        userPostsError: error,
        userPostsValidating: isValidating,
        userPostsEmpty: !isLoading && (data?.length || 0) === 0,
      }),
      [data, error, isLoading, isValidating]
    );
  
    return memoizedValue;
  }