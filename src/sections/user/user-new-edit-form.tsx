import * as Yup from 'yup';
import { useMemo, useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Switch from '@mui/material/Switch';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import FormControlLabel from '@mui/material/FormControlLabel';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { fData } from 'src/utils/format-number';

import { countries } from 'src/assets/data';

import Label from 'src/components/label';
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, {
  RHFSwitch,
  RHFTextField,
  RHFUploadAvatar,
  RHFAutocomplete,
} from 'src/components/hook-form';

import { IUserItem } from 'src/types/user';
import { ref,getDownloadURL, uploadBytesResumable } from 'firebase/storage';
import { fetchProfilePhoto, updateProfilePhoto } from 'src/api/my-account';
import { LinearProgress } from '@mui/material';

import { useMockedUser } from 'src/hooks/use-mocked-user';

import { storage } from '../auth/firebase/firebase-image';

// ----------------------------------------------------------------------

type Props = {
  currentUser?: IUserItem;
};

export default function UserNewEditForm({ currentUser }: Props) {
  const router = useRouter();
  const { user } = useMockedUser();
  const { enqueueSnackbar } = useSnackbar();
  const [photoUrl, setPhotoUrl] = useState<string>();
  const [loading, setLoading] = useState<boolean>(true);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
const [fetchProgress, setFetchProgress] = useState<number>(0);


  const NewUserSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    email: Yup.string().required('Email is required').email('Email must be a valid email address'),
    phoneNumber: Yup.string().required('Phone number is required'),
    address: Yup.string().required('Address is required'),
    country: Yup.string().required('Country is required'),
    company: Yup.string().required('Company is required'),
    state: Yup.string().required('State is required'),
    city: Yup.string().required('City is required'),
    role: Yup.string().required('Role is required'),
    zipCode: Yup.string().required('Zip code is required'),
    avatarUrl: Yup.mixed<any>().nullable().required('Avatar is required'),
    // not required
    status: Yup.string(),
    isVerified: Yup.boolean(),
  });

  useEffect(() => {
    const getPhoto = async () => {
      setLoading(true);
      setFetchProgress(0);
    
      const interval = setInterval(() => {
        setFetchProgress((prev) => Math.min(prev + 20, 100));
      }, 200);
    
      try {
        const photo = await fetchProfilePhoto(user?.userId);
        setPhotoUrl(photo || '');
      } catch (error) {
        console.error('Error fetching profile photo:', error);
      } finally {
        clearInterval(interval);
        setFetchProgress(100);
        setLoading(false);
      }
    };
    
    getPhoto();
  }, [user?.userId]);

  console.log(photoUrl,'tttttttttt');
  

  const defaultValues = useMemo(
    () => ({
      name: currentUser?.name || '',
      city: currentUser?.city || '',
      role: currentUser?.role || '',
      email: currentUser?.email || '',
      state: currentUser?.state || '',
      status: currentUser?.status || '',
      address: currentUser?.address || '',
      country: currentUser?.country || '',
      zipCode: currentUser?.zipCode || '',
      company: currentUser?.company || '',
      avatarUrl: photoUrl || currentUser?.avatarUrl || '', 
      phoneNumber: currentUser?.phoneNumber || '',
      isVerified: currentUser?.isVerified || true,
    }),
    [currentUser,photoUrl]
  );

  const methods = useForm({
    resolver: yupResolver(NewUserSchema),
    defaultValues,
    reValidateMode: 'onChange',
  });

  const {
    reset,
    watch,
    control,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  const [uploading, setUploading] = useState(false);
  
  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);
  const onSubmit = handleSubmit(async (data) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      reset();
      enqueueSnackbar(currentUser ? 'Update success!' : 'Create success!');
      router.push(paths.dashboard.user.list);
      console.info('DATA', data);
    } catch (error) {
      console.error(error);
    }
  });

  const handleDrop = async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;
  
    setUploading(true);
  
    try {
      const storageRef = ref(storage, `profilePhotos/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);
  
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(progress); // Update progress
          console.log(`Upload is ${progress}% done`);
        },
        (error) => {
          console.error('Upload error:', error);
          enqueueSnackbar('Failed to upload image', { variant: 'error' });
          setUploading(false);
        },
        async () => {
          const imageUrl = await getDownloadURL(uploadTask.snapshot.ref);
          console.log('File available at', imageUrl);
          const isUpdated = await updateProfilePhoto(user?.userId || '', imageUrl);
          if (isUpdated) {
            setValue('avatarUrl', imageUrl, { shouldValidate: true });
            enqueueSnackbar('Profile photo updated successfully', { variant: 'success' });
          } else {
            enqueueSnackbar('Failed to update profile photo', { variant: 'error' });
          }
          setUploading(false);
          setUploadProgress(100); // Complete progress
        }
      );
      
    } catch (error) {
      console.error('Error uploading file:', error);
      enqueueSnackbar('Failed to upload image', { variant: 'error' });
      setUploading(false);
    }
  };
  
 
  

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid xs={12} md={4}>
          <Card sx={{ pt: 10, pb: 5, px: 3 }}>
            {currentUser && (
              <Label
                color={
                  (values.status === 'active' && 'success') ||
                  (values.status === 'banned' && 'error') ||
                  'warning'
                }
                sx={{ position: 'absolute', top: 24, right: 24 }}
              >
                {values.status}
              </Label>
            )}

            <Box sx={{ mb: 5 }}>
            
            <Box sx={{ mb: 5 }}>
  <RHFUploadAvatar
    name="avatarUrl"
    maxSize={3145728}
    onDrop={handleDrop}
    disabled={uploading}
    helperText={
      <Typography
        variant="caption"
        sx={{
          mt: 3,
          mx: 'auto',
          display: 'block',
          textAlign: 'center',
          color: 'text.disabled',
        }}
      >
        Allowed *.jpeg, *.jpg, *.png, *.gif
        <br /> max size of {fData(3145728)}
      </Typography>
    }
  />
  <Box sx={{ width: '100%', mt: 2 }}>
    {(uploading || loading) && (
      <LinearProgress
        variant="determinate"
        value={uploading ? uploadProgress : fetchProgress}
      />
    )}
  </Box>
</Box>


            </Box>

            {currentUser && (
              <FormControlLabel
                labelPlacement="start"
                control={
                  <Controller
                    name="status"
                    control={control}
                    render={({ field }) => (
                      <Switch
                        {...field}
                        checked={field.value !== 'active'}
                        onChange={(event) =>
                          field.onChange(event.target.checked ? 'banned' : 'active')
                        }
                      />
                    )}
                  />
                }
                label={
                  <>
                    <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                      Banned
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      Apply disable account
                    </Typography>
                  </>
                }
                sx={{ mx: 0, mb: 3, width: 1, justifyContent: 'space-between' }}
              />
            )}

            <RHFSwitch
              name="isVerified"
              labelPlacement="start"
              label={
                <>
                  <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                    Email Verified
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Disabling this will automatically send the user a verification email
                  </Typography>
                </>
              }
              sx={{ mx: 0, width: 1, justifyContent: 'space-between' }}
            />

            {currentUser && (
              <Stack justifyContent="center" alignItems="center" sx={{ mt: 3 }}>
                <Button variant="soft" color="error">
                  Delete User
                </Button>
              </Stack>
            )}
          </Card>
        </Grid>

        <Grid xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
              }}
            >
              <RHFTextField name="name" label="Full Name" />
              <RHFTextField name="email" label="Email Address" />
              <RHFTextField name="phoneNumber" label="Phone Number" />



              <RHFAutocomplete
                name="country"
                type="country"
                label="Country"
                placeholder="Choose a country"
                fullWidth
                options={countries.map((option) => option.label)}
                getOptionLabel={(option) => option}
              />

              <RHFTextField name="state" label="State/Region" />
              <RHFTextField name="city" label="City" />
              <RHFTextField name="address" label="Address" />
              <RHFTextField name="zipCode" label="Zip/Code" />
              <RHFTextField name="company" label="Company" />
              <RHFTextField name="role" label="Role" />
            </Box>

            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                {!currentUser ? 'Create User' : 'Save Changes'}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
