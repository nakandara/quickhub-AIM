import Container from '@mui/material/Container';
import { paths } from 'src/routes/paths';
import { _userList } from 'src/_mock';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { getProfileDetails } from 'src/api/my-account';
import { useEffect, useState } from 'react';
import { useMockedUser } from 'src/hooks/use-mocked-user';
import UserNewEditForm from '../user-new-edit-form';

// ----------------------------------------------------------------------

type Props = {
  id: string;
};

export default function UserEditView({ id }: Props) {
  const settings = useSettingsContext();
  const { user } = useMockedUser();
  const [currentUser, setCurrentUser] = useState<any | null>(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const userDetails = await getProfileDetails(user?.userId);
        if (!userDetails) {
          throw new Error('User details not found.');
        }
        setCurrentUser(userDetails); // Set the fetched user details
      } catch (error) {
        console.error('Error fetching profile details:', error);
      }
    };

    if (user?.userId) {
      fetchUserDetails();
    }
  }, [user?.userId]);

  
  

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Edit"
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.root,
          },
          {
            name: 'User',
            href: paths.dashboard.user.root,
          },
          { name: currentUser?.username || 'Loading...' }, // Dynamically show the name
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <UserNewEditForm currentUser={currentUser} /> {/* Pass currentUser */}
    </Container>
  );
}
