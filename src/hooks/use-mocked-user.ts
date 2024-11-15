import { useAuthContext } from 'src/auth/hooks';

// ----------------------------------------------------------------------

export function useMockedUser() {
  // Use useAuthContext to get user data
  const { user } = useAuthContext();

  // Now you can log user data
  console.log(user, 'bbkkkkkkbbbb');

  return { user };
}
