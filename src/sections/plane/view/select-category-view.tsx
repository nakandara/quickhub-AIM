import Button from '@mui/material/Button';
import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { _userCards } from 'src/_mock';

import Iconify from 'src/components/iconify';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import CategoryCardList from '../category-card-list';

const users = [
    {
      id: "e99f09a7-dd88-49d5-b1c8-1daf80c2d7b1",
      avatarUrl: "https://firebasestorage.googleapis.com/v0/b/datamithurunode.appspot.com/o/profilePhotos%2FLeonardo_Phoenix_09_Create_a_modern_illustration_of_a_sleek_hi_3.jpg?alt=media&token=265f451f-783b-4646-9579-fb19d50e4154",
      coverUrl: "https://firebasestorage.googleapis.com/v0/b/datamithurunode.appspot.com/o/profilePhotos%2FLeonardo_Phoenix_09_Create_a_modern_illustration_of_a_sleek_hi_3.jpg?alt=media&token=265f451f-783b-4646-9579-fb19d50e4154",
      name: "vehicles",
      role: "vehicles",
      content1:"1. Your advertisement receives premium placement for maximum visibility.",
      content2:"2. Enhanced Visibility: Highlighted listings attract more attention from potential buyers or renters.",
      content3:"3. Priority Support: Access to dedicated customer support for swift resolution of any issues.",
      totalFollowers: 9911,
      totalFollowing: 1947,
      totalPosts: 9124,
    },
    {
      id: "e99f09a7-dd88-49d5-b1c8-1daf80c2d7b2",
      avatarUrl: "https://firebasestorage.googleapis.com/v0/b/datamithurunode.appspot.com/o/profilePhotos%2FLeonardo_Phoenix_09_Create_a_modern_illustration_of_a_property_2%20(1).jpg?alt=media&token=d52249fa-aaf3-4d03-b2e7-75748e32db04",
      coverUrl: "https://firebasestorage.googleapis.com/v0/b/datamithurunode.appspot.com/o/profilePhotos%2FLeonardo_Phoenix_09_Create_a_modern_illustration_of_a_property_2%20(1).jpg?alt=media&token=d52249fa-aaf3-4d03-b2e7-75748e32db04",
      name: "properties",
      role: "properties",
      content1:"1. Standard Placement: Your advertisement is displayed prominently among other listings.",
      content2:"2. Moderate Visibility: Listings are visible to a wide audience, ensuring decent exposure.",
      content3:"3. Basic Support: Standard assistance is available for any queries or concerns.",
      totalFollowers: 1947,
      totalFollowing: 9124,
      totalPosts: 6984,
    },
    // {
    //     id: "e99f09a7-dd88-49d5-b1c8-1daf80c2d7b2",
    //     avatarUrl: "https://worldadd-api.vercel.app/assets/images/avatar/avatar_2.jpg",
    //     coverUrl: "https://worldadd-api.vercel.app/assets/images/cover/cover_2.jpg",
    //     name: "gold",
    //     role: "Data Analyst",
    //     totalFollowers: 1947,
    //     totalFollowing: 9124,
    //     totalPosts: 6984,
    //   },
    // Add more user objects as needed
  ];



// ----------------------------------------------------------------------

export default function SelectCategoryView() {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="User Plane"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'User', href: paths.dashboard.user.root },
          { name: 'Plane' },
        ]}
        action={
          <Button
            component={RouterLink}
            href={paths.dashboard.user.new}
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
          >
            New User
          </Button>
        }
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <CategoryCardList users={users} />
    </Container>
  );
}
