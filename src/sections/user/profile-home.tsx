import { useRef, useState } from 'react';

import Fab from '@mui/material/Fab';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import { alpha } from '@mui/material/styles';

import InputBase from '@mui/material/InputBase';
import Grid from '@mui/material/Unstable_Grid2';
import CardHeader from '@mui/material/CardHeader';
import Badge from '@mui/material/Badge';

import { fNumber } from 'src/utils/format-number';

import { _socials } from 'src/_mock';

import Iconify from 'src/components/iconify';

import { IUserProfile, IUserProfilePost } from 'src/types/user';

import ProfilePostItem from './profile-post-item';

// ----------------------------------------------------------------------

type Props = {
  info: IUserProfile | null; // Allow info to be null
  posts: IUserProfilePost[];
};

// Default values for the info prop
const defaultInfo: IUserProfile = {
  _id: '',
  userId: '',
  username: '',
  birthday: '',
  district: '',
  city: '',
  country: '',
  email: '',
  gender: '',
  isVerified: false,
  phoneNumber: '',
  state: '',
  status: '',
  zipCode: '',
  avatarUrl: '',
  address: '',
  __v: 0,
};

export default function ProfileHome({ info = defaultInfo, posts }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [isEditMode, setIsEditMode] = useState(false); // State for edit mode
  const [editedInfo, setEditedInfo] = useState<IUserProfile>(info || defaultInfo); // State for edited data

  const handleAttach = () => {
    if (fileRef.current) {
      fileRef.current.click();
    }
  };

  console.log(info, 'infoinfo');

  const toggleEditMode = () => {
    if (!isEditMode) {
      // When entering edit mode, reset editedInfo with the current info data
      setEditedInfo(info || defaultInfo);
    }
    setIsEditMode(!isEditMode);
  };

  const handleChange = (field: keyof IUserProfile, value: string) => {
    setEditedInfo((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    // Save the updated data (you can add API calls or other logic here)
    console.log('Updated Info:', editedInfo);
    setIsEditMode(false); // Exit edit mode
  };

  const renderEditIcon = () => (
    <Iconify
      icon="material-symbols:edit"
      width={24}
      sx={{ cursor: 'pointer', color: 'text.secondary' }}
      onClick={toggleEditMode}
    />
  );

  const renderFollows = (
    <Card sx={{ py: 3, textAlign: 'center', typography: 'h4' }}>
      <Stack
        direction="row"
        divider={<Divider orientation="vertical" flexItem sx={{ borderStyle: 'dashed' }} />}
      >
        <Stack width={1}>
          {info?.isVerified && <div>Verify</div>}
          <Box component="span" sx={{ color: 'text.secondary', typography: 'body2' }}>
            status
          </Box>
        </Stack>

        <Stack width={1}>
          {info?.username}
          <Box component="span" sx={{ color: 'text.secondary', typography: 'body2' }}>
            Following
          </Box>
        </Stack>
      </Stack>
    </Card>
  );

  const renderAbout = (
    <Card>
      <CardHeader
        title="About"
        action={renderEditIcon()} // Add edit icon to the header
      />

      <Stack spacing={2} sx={{ p: 3 }}>
        {/* Username */}
        {isEditMode ? (
          <InputBase
            fullWidth
            value={editedInfo.username}
            onChange={(e) => handleChange('username', e.target.value)}
            sx={{ typography: 'body2', border: '1px solid', p: 1, borderRadius: 1 }}
          />
        ) : (
          <Box sx={{ typography: 'body2' }}>{info?.username}</Box>
        )}

        {/* Address */}
        <Stack direction="row" spacing={2}>
          <Iconify icon="mingcute:location-fill" width={24} />
          {isEditMode ? (
            <InputBase
              fullWidth
              value={editedInfo.address}
              onChange={(e) => handleChange('address', e.target.value)}
              sx={{ typography: 'body2', border: '1px solid', p: 1, borderRadius: 1 }}
            />
          ) : (
            <Box sx={{ typography: 'body2' }}>
              {info?.address}
            </Box>
          )}
        </Stack>

        {/* City, District, Country */}
        <Stack direction="row" spacing={2}>
          <Iconify icon="mingcute:location-fill" width={24} />
          {isEditMode ? (
            <InputBase
              fullWidth
              value={`${editedInfo.city}, ${editedInfo.district}, ${editedInfo.country}`}
              onChange={(e) => {
                const [city, district, country] = e.target.value.split(', ');
                handleChange('city', city);
                handleChange('district', district);
                handleChange('country', country);
              }}
              sx={{ typography: 'body2', border: '1px solid', p: 1, borderRadius: 1 }}
            />
          ) : (
            <Box sx={{ typography: 'body2' }}>
              {`${info?.city}, ${info?.district}, ${info?.country}`}
            </Box>
          )}
        </Stack>

        {/* Gender */}
        <Stack direction="row" sx={{ typography: 'body2' }}>
          <Iconify icon="fluent:mail-24-filled" width={24} sx={{ mr: 2 }} />
          {isEditMode ? (
            <InputBase
              fullWidth
              value={editedInfo.gender}
              onChange={(e) => handleChange('gender', e.target.value)}
              sx={{ typography: 'body2', border: '1px solid', p: 1, borderRadius: 1 }}
            />
          ) : (
            info?.gender
          )}
        </Stack>

        {/* Email */}
        <Stack direction="row" spacing={2}>
          <Iconify icon="fluent:mail-24-filled" width={24} />
          {isEditMode ? (
            <InputBase
              fullWidth
              value={editedInfo.email}
              onChange={(e) => handleChange('email', e.target.value)}
              sx={{ typography: 'body2', border: '1px solid', p: 1, borderRadius: 1 }}
            />
          ) : (
            <Box sx={{ typography: 'body2' }}>
              <Link href={`mailto:${info?.email}`} variant="subtitle2" color="inherit" underline="hover">
                {info?.email}
              </Link>
            </Box>
          )}
        </Stack>

        {/* Phone Number */}
        <Stack direction="row" spacing={2}>
          <Iconify icon="ic:round-business-center" width={24} />
          {isEditMode ? (
            <InputBase
              fullWidth
              value={editedInfo.phoneNumber}
              onChange={(e) => handleChange('phoneNumber', e.target.value)}
              sx={{ typography: 'body2', border: '1px solid', p: 1, borderRadius: 1 }}
            />
          ) : (
            <Box sx={{ typography: 'body2' }}>
              {info?.phoneNumber}
            </Box>
          )}
        </Stack>

        {/* State */}
        <Stack direction="row" spacing={2}>
          <Iconify icon="ic:round-business-center" width={24} />
          {isEditMode ? (
            <InputBase
              fullWidth
              value={editedInfo.state}
              onChange={(e) => handleChange('state', e.target.value)}
              sx={{ typography: 'body2', border: '1px solid', p: 1, borderRadius: 1 }}
            />
          ) : (
            <Box sx={{ typography: 'body2' }}>
              {info?.state}
            </Box>
          )}
        </Stack>

        {/* Zip Code */}
        <Stack direction="row" spacing={2}>
          <Iconify icon="ic:round-business-center" width={24} />
          {isEditMode ? (
            <InputBase
              fullWidth
              value={editedInfo.zipCode}
              onChange={(e) => handleChange('zipCode', e.target.value)}
              sx={{ typography: 'body2', border: '1px solid', p: 1, borderRadius: 1 }}
            />
          ) : (
            <Box sx={{ typography: 'body2' }}>
              {info?.zipCode}
            </Box>
          )}
        </Stack>

        {/* Birthday */}
        <Stack direction="row" spacing={2}>
          <Iconify icon="ic:round-business-center" width={24} />
          {isEditMode ? (
            <InputBase
              fullWidth
              value={editedInfo.birthday}
              onChange={(e) => handleChange('birthday', e.target.value)}
              sx={{ typography: 'body2', border: '1px solid', p: 1, borderRadius: 1 }}
            />
          ) : (
            <Box sx={{ typography: 'body2' }}>
              {info?.birthday}
            </Box>
          )}
        </Stack>
      </Stack>

      {isEditMode && (
        <Box sx={{ p: 3, display: 'flex', justifyContent: 'flex-end' }}>
          <Button variant="contained" onClick={handleSave}>
            Save
          </Button>
        </Box>
      )}
    </Card>
  );

  const renderPostInput = (
    <Card sx={{ p: 3 }}>
      <InputBase
        multiline
        fullWidth
        rows={4}
        placeholder="Share what you are thinking here..."
        sx={{
          p: 2,
          mb: 3,
          borderRadius: 1,
          border: (theme) => `solid 1px ${alpha(theme.palette.grey[500], 0.2)}`,
        }}
      />

      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Stack direction="row" spacing={1} alignItems="center" sx={{ color: 'text.secondary' }}>
          <Fab size="small" color="inherit" variant="softExtended" onClick={handleAttach}>
            <Iconify icon="solar:gallery-wide-bold" width={24} sx={{ color: 'success.main' }} />
            Image/Video
          </Fab>

          <Fab size="small" color="inherit" variant="softExtended">
            <Iconify icon="solar:videocamera-record-bold" width={24} sx={{ color: 'error.main' }} />
            Streaming
          </Fab>
        </Stack>

        <Button variant="contained">Post</Button>
      </Stack>

      <input ref={fileRef} type="file" style={{ display: 'none' }} />
    </Card>
  );

  const renderSocials = (
    <Card>
      <CardHeader title="Social" />

      <Stack spacing={2} sx={{ p: 3 }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Iconify icon="fluent:mail-24-filled" width={24} />
          <Box sx={{ typography: 'body2' }}>
            <Link href={`mailto:${info?.email}`} variant="subtitle2" color="inherit" underline="hover">
              {info?.email}
            </Link>
          </Box>
        </Stack>
      </Stack>
    </Card>
  );

  return (
    <Grid container spacing={3}>
      <Grid xs={12} md={4}>
        <Stack spacing={3}>
          {renderFollows}
          {renderAbout}
          {renderSocials}
        </Stack>
      </Grid>

      <Grid xs={12} md={8}>
        <Stack spacing={3}>
          {renderPostInput}

          {/* {posts.map((post) => (
            <ProfilePostItem key={post.id} post={post} />
          ))} */}
        </Stack>
      </Grid>
    </Grid>
  );
}