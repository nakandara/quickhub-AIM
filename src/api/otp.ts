import useSWR from 'swr';

import { useMemo } from 'react';
import { HOST_API } from 'src/config-global';
import axios, { fetcher, endpoints } from 'src/utils/axios';
import useSWRMutation from 'swr/mutation';

const getOtpEndpoint = (userId: string) => `${HOST_API}/api/get-otp/${userId}`;

// Custom hook to get OTP data
export function useGetOtp(userId: string) {
  const URL = userId ? getOtpEndpoint(userId) : null;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      otpData: data || [],
      otpDataLoading: isLoading,
      otpDataError: error,
      otpDataValidating: isValidating,
      otpDataEmpty: !isLoading && !data?.length,
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

const sendOtpEndpoint = `${HOST_API}/api/send-otp`;

const sendOtp = async (url: string, { arg }: { arg: { phoneNumber: string } }) => {
  const response = await axios.post(url, { phoneNumber: arg.phoneNumber });
  return response.data;
};

// Custom hook to send OTP
export function useSendOtp() {
  const { trigger, isMutating, error } = useSWRMutation(sendOtpEndpoint, sendOtp);

  return {
    sendOtp: trigger,
    isSendingOtp: isMutating,
    sendOtpError: error,
  };
}

const verifyOtpEndpoint = `${HOST_API}/api/verify-otp`;

const verifyOtp = async (url: string, { arg }: { arg: { phoneNumber: string; otp: string; userId: string } }) => {
  const response = await axios.post(url, {
    phoneNumber: arg.phoneNumber,
    otp: arg.otp,
    userId: arg.userId,
  });
  return response.data;
};


export function useVerifyOtp() {
  const { trigger, isMutating, error } = useSWRMutation(verifyOtpEndpoint, verifyOtp);

  return {
    verifyOtp: trigger,
    isVerifyingOtp: isMutating,
    verifyOtpError: error,
  };
}