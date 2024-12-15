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
      avatarUrl: "https://worldadd-api.vercel.app/assets/images/avatar/avatar_1.jpg",
      coverUrl: "https://worldadd-api.vercel.app/assets/images/cover/cover_1.jpg",
      name: "vehicles",
      role: "vehicles",
      totalFollowers: 9911,
      totalFollowing: 1947,
      totalPosts: 9124,
    },
    {
      id: "e99f09a7-dd88-49d5-b1c8-1daf80c2d7b2",
      avatarUrl: "https://worldadd-api.vercel.app/assets/images/avatar/avatar_2.jpg",
      coverUrl: "https://worldadd-api.vercel.app/assets/images/cover/cover_2.jpg",
      name: "properties",
      role: "properties",
      totalFollowers: 1947,
      totalFollowing: 9124,
      totalPosts: 6984,
    },
    {
        id: "e99f09a7-dd88-49d5-b1c8-1daf80c2d7b2",
        avatarUrl: "https://worldadd-api.vercel.app/assets/images/avatar/avatar_2.jpg",
        coverUrl: "https://worldadd-api.vercel.app/assets/images/cover/cover_2.jpg",
        name: "gold",
        role: "Data Analyst",
        totalFollowers: 1947,
        totalFollowing: 9124,
        totalPosts: 6984,
      },
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
