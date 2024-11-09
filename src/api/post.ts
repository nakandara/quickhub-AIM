import useSWR from 'swr';
import { useMemo } from 'react';

import { fetcher, endpoints } from 'src/utils/axios';

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
    const URL = 'https://worldadd-api.vercel.app/api/getVerifyAllPosts';
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