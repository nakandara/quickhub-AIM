import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import ListItemText from '@mui/material/ListItemText';
import { alpha, useTheme } from '@mui/material/styles';

import { fShortenNumber } from 'src/utils/format-number';

import { _socials } from 'src/_mock';
import { AvatarShape } from 'src/assets/illustrations';

import Image from 'src/components/image';
import Iconify from 'src/components/iconify';

import { IUserCard } from 'src/types/user';

// ----------------------------------------------------------------------

type Props = {
  user: IUserCard;
  onClick: () => void; // Add onClick prop
};

export default function CategoryCard({ user,onClick }: Props) {
  const theme = useTheme();

  const { name, coverUrl, role,content1,content2,content3, totalFollowers, totalPosts, avatarUrl, totalFollowing } = user;

  

  return (
 <Card sx={{ textAlign: 'center', cursor: 'pointer' }} onClick={onClick}>
  <Box sx={{ position: 'relative' }}>
    <AvatarShape
      sx={{
        left: 0,
        right: 0,
        zIndex: 10,
        mx: 'auto',
        bottom: -26,
        position: 'absolute',
      }}
    />

    <Avatar
      alt={name}
      src={avatarUrl}
      sx={{
        width: 64,
        height: 64,
        zIndex: 11,
        left: 0,
        right: 0,
        bottom: -32,
        mx: 'auto',
        position: 'absolute',
      }}
    />

    <Image
      src={coverUrl}
      alt={coverUrl}
      ratio="16/9"
      overlay={alpha(theme.palette.grey[900], 0.48)}
    />
  </Box>


<ListItemText
  sx={{ mt: 7, mb: 1 }}
  primary={name}
  primaryTypographyProps={{ typography: 'subtitle1' }}
/>

<Stack spacing={1} sx={{ px: 2, mb: 2 }}>
  <Typography variant="body2" color="text.secondary">
    {content1}
  </Typography>
  <Typography variant="body2" color="text.secondary">
    {content2}
  </Typography>
  <Typography variant="body2" color="text.secondary">
    {content3}
  </Typography>
</Stack>

  <Stack direction="row" alignItems="center" justifyContent="center" sx={{ mb: 2.5 }}>
    {/* {_socials.map((social) => (
      <IconButton
        key={social.name}
        sx={{
          color: social.color,
          '&:hover': {
            bgcolor: alpha(social.color, 0.08),
          },
        }}
      >
        <Iconify icon={social.icon} />
      </IconButton>
    ))} */}
  </Stack>

  <Divider sx={{ borderStyle: 'dashed' }} />

  <Box
    display="grid"
    gridTemplateColumns="repeat(3, 1fr)"
    sx={{ py: 3, typography: 'subtitle1' }}
  >
    <div>
      <Typography variant="caption" component="div" sx={{ mb: 0.5, color: 'text.secondary' }}>
        Follower
      </Typography>
      {fShortenNumber(totalFollowers)}
    </div>

    <div>
      <Typography variant="caption" component="div" sx={{ mb: 0.5, color: 'text.secondary' }}>
        Following
      </Typography>
      {fShortenNumber(totalFollowing)}
    </div>

    <div>
      <Typography variant="caption" component="div" sx={{ mb: 0.5, color: 'text.secondary' }}>
        Total Post
      </Typography>
      {fShortenNumber(totalPosts)}
    </div>
  </Box>
</Card>
  );
}
