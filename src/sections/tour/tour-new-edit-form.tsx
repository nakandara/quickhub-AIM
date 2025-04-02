import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, Controller } from 'react-hook-form';
import { useMemo, useEffect, useCallback, useState } from 'react';
import { useParams } from "react-router-dom";

import Chip from '@mui/material/Chip';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';

import Switch from '@mui/material/Switch';
import Grid from '@mui/material/Unstable_Grid2';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import FormControlLabel from '@mui/material/FormControlLabel';

import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useResponsive } from 'src/hooks/use-responsive';

import { countries } from 'src/assets/data';
import { _tags, _tourGuides,CONDITION } from 'src/_mock';

import { useSnackbar } from 'src/components/snackbar';
import FormProvider, {
  RHFEditor,
  RHFTextField,
  RHFAutocomplete,
  RHFMultiCheckbox,
} from 'src/components/hook-form';

import { useMockedUser } from 'src/hooks/use-mocked-user';
import { createPost, editPost } from 'src/api/post';
import { Box } from '@mui/system';
import { Button, CircularProgress, IconButton } from '@mui/material';
import Iconify from 'src/components/iconify/iconify';
import { storage } from '../auth/firebase/firebase-image';

export default function TourNewEditForm({ currentTour }: any) {
  const router = useRouter();
  const { user } = useMockedUser();
  const pathParts = window.location.pathname.split('/');
  const city = pathParts.slice(-2).join('/');

  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  const [uploading, setUploading] = useState(false);
  const { id } = useParams(); 
  const mdUp = useResponsive('up', 'md');

  const { enqueueSnackbar } = useSnackbar();

  const selectedTour = Array.isArray(currentTour) ? currentTour.find((tour) => tour._id === id) : null;

  useEffect(() => {
    if (!user?._id) {
      enqueueSnackbar('Please login to your account to proceed.', { variant: 'warning' });
      router.push(paths.auth.amplify.login); // Redirect to login page
    }
  }, [user, enqueueSnackbar, router]);

  const NewTourSchema = Yup.object().shape({
    userId: Yup.string().required('User ID is required'),
    title: Yup.string().required('Title is required'),
    bodyType: Yup.string().required('Body Type is required'),
    mobileNumber: Yup.string()
      .required('Mobile number is required')
      .matches(/^[0-9]{10}$/, 'Mobile number must be exactly 10 digits'),
    whatsappNumber: Yup.string()
      .required('whatsappNumber number is required')
      .matches(/^[0-9]{10}$/, 'Mobile number must be exactly 10 digits'),
    brand: Yup.string().required('brand Type is required'),
    price: Yup.string().required('Price is required'),
    description: Yup.string().required('Description is required'),
    images: Yup.array().of(Yup.mixed()).min(1, 'Images are required'),
    fuelType: Yup.array()
      .of(Yup.string())
      .min(1, 'Must have at least 1 fuel type')
      .required('Fuel type is required'),
    transmission: Yup.array()
      .of(Yup.string())
      .min(1, 'Must have at least 1 transmission type')
      .required('Transmission type is required'),
    yearOfManufacture: Yup.string().required('Year of Manufacture is required'),
    engineCapacity: Yup.string().required('Engine Capacity is required'),
    mileage: Yup.string()
      .required('Mileage is required')
      .matches(/^\d+$/, 'Mileage must be a number'),
    tags: Yup.array().of(Yup.string()).min(2, 'Must have at least 2 tags'),
    condition: Yup.string()
      .required('Condition is required')
      .oneOf(['Used', 'New', 'Recondition'], 'Invalid condition'),
  });

  const defaultValues = useMemo(
    () => ({
      userId: user?.userId || '',
      title: selectedTour?.title || '',
      price: selectedTour?.price || '',
      bodyType: selectedTour?.bodyType || '',
      city: selectedTour?.city || '',
      brand: selectedTour?.brand || '',
      description: selectedTour?.description || '',
      images: selectedTour?.images || [],
      fuelType: selectedTour?.fuelType || [],
      transmission: selectedTour?.transmission || [],
      tags: selectedTour?.tags || [],
      yearOfManufacture: selectedTour?.yearOfManufacture || '',
      engineCapacity: selectedTour?.engineCapacity || '',
      mileage: selectedTour?.mileage || '',
      mobileNumber: selectedTour?.mobileNumber || '', 
      whatsappNumber: selectedTour?.mobileNumber || '',
      condition: selectedTour?.condition || 'Used',
    }),
    [selectedTour, user]
  );

  const methods = useForm<any>({
    resolver: yupResolver(NewTourSchema),
    defaultValues,
  });

  const {
    watch,
    reset,
    control,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  useEffect(() => {
    if (currentTour) {
      reset(defaultValues);
    }
  }, [currentTour, defaultValues, reset]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      
      data.city = city;
      
      if (selectedTour && selectedTour.postId) {
        const response = await editPost(selectedTour.postId, data);
        if (response.success) {
          enqueueSnackbar('Update success!');
          router.push(paths.dashboard.tour.root);
        } else {
          throw new Error(response.error || 'Failed to update post');
        }
      } else {
        await createPost(data);
        enqueueSnackbar('Create success!');
        router.push(paths.dashboard.tour.root);
      }
      
      console.info('Submitted Data:', data);
    } catch (error) {
      console.error('Submission Error:', error);
      enqueueSnackbar(error.message || 'An error occurred', { variant: 'error' });
    }
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const currentImages = values.images || [];

    if (currentImages.length + files.length > 4) {
      console.log('Limit Exceeded', 'You can upload a maximum of 4 images.', 'warning');
      return;
    }

    setUploading(true);

    const uploadedImageUrls = await Promise.all(
      files.map(
        (file) =>
          new Promise<string>((resolve, reject) => {
            const storageRef = ref(storage, `images/${file.name}`);
            const uploadTask = uploadBytesResumable(storageRef, file);

            uploadTask.on(
              'state_changed',
              (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setUploadProgress((prev) => ({
                  ...prev,
                  [file.name]: Math.round(progress),
                }));
              },
              (error) => {
                console.error('Upload error:', error);
                reject(error);
              },
              async () => {
                const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                resolve(downloadURL);
              }
            );
          })
      )
    );

    setValue('images', [...currentImages, ...uploadedImageUrls]);
    setUploading(false);
  };

  const handleRemoveImage = (index: number) => {
    const updatedImages = values.images.filter((_: any, i: number) => i !== index);
    setValue('images', updatedImages);
  };

  const renderDetails = (
    <>
      {mdUp && (
        <Grid md={4}>
          <Typography variant="h6" sx={{ mb: 0.5 }}>
            Details
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Title, short description, image...
          </Typography>
        </Grid>
      )}

      <Grid xs={12} md={8}>
        <Card>
          {!mdUp && <CardHeader title="Details" />}

          <Stack spacing={3} sx={{ p: 3 }}>
            <Stack spacing={1.5}>
              <Typography variant="subtitle2">Title</Typography>
              <RHFTextField name="title" placeholder="Ex: Adventure Seekers Expedition..." />
            </Stack>
            <Stack spacing={1.5}>
              <Typography variant="subtitle2">price</Typography>
              <RHFTextField name="price" placeholder="Ex: price.." />
            </Stack>

            <Stack spacing={1.5}>
              <Typography variant="subtitle2">Description</Typography>
              <RHFEditor simple name="description" />
            </Stack>
            <Stack spacing={1.5}>
              <Typography variant="subtitle2">body Type</Typography>
              <RHFTextField name="bodyType" placeholder="Ex: bodyType.." />
            </Stack>
            <Stack spacing={1.5}>
              <Typography variant="subtitle2">Brand</Typography>
              <RHFTextField name="brand" placeholder="Ex: brand.." />
            </Stack>

            <Box mt={2}>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileUpload}
                style={{ display: 'none' }}
                id="upload-button"
              />
              <label htmlFor="upload-button">
                <Button variant="contained" color="primary" component="span" disabled={uploading}>
                  {uploading ? 'Uploading...' : 'Upload Images'}
                </Button>
              </label>
              <Box mt={2}>
                {values.images?.map((url: string, index: number) => (
                  <Box key={index} display="flex" alignItems="center" mb={1}>
                    <img
                      src={url}
                      alt={`uploaded-${index}`}
                      width="100"
                      style={{ marginRight: '10px' }}
                    />
                    <IconButton color="error" onClick={() => handleRemoveImage(index)}>
                      <Iconify icon="mingcute:close-line" width={16} />
                    </IconButton>
                  </Box>
                ))}
                {uploading && (
                  <Box mt={1}>
                    {Object.entries(uploadProgress).map(([file, progress]) => (
                      <Box key={file} display="flex" alignItems="center">
                        <span>{file}:</span>
                        <CircularProgress variant="determinate" value={progress} size={30} />
                      </Box>
                    ))}
                  </Box>
                )}
              </Box>
            </Box>
          </Stack>
        </Card>
      </Grid>
    </>
  );

  const renderProperties = (
    <>
      {mdUp && (
        <Grid md={4}>
          <Typography variant="h6" sx={{ mb: 0.5 }}>
            Properties
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Additional functions and attributes...
          </Typography>
        </Grid>
      )}

      <Grid xs={12} md={8}>
        <Card>
          {!mdUp && <CardHeader title="Properties" />}

          <Stack spacing={3} sx={{ p: 3 }}>
            {/* Add Condition Field Here */}
            <Stack>
              <Typography variant="subtitle2" sx={{ mb: 1.5 }}>
                Condition
              </Typography>
              <RHFAutocomplete
                name="condition"
                options={['Used', 'New', 'Recondition']}
                getOptionLabel={(option) => option}
                isOptionEqualToValue={(option, value) => option === value}
                renderOption={(props, option) => (
                  <li {...props} key={option}>
                    {option}
                  </li>
                )}
              />
            </Stack>

            <Stack>
              <Typography variant="subtitle2" sx={{ mb: 1.5 }}>
                Tour Guide
              </Typography>
              <Stack>
                <Typography variant="subtitle2" sx={{ mb: 1.5 }}>
                  Fuel Type
                </Typography>

                <RHFAutocomplete
                  name="fuelType"
                  multiple={false}
                  placeholder="Select Fuel Type"
                  options={['Petrol', 'Diesel']}
                  getOptionLabel={(option) => option}
                  isOptionEqualToValue={(option, value) => option === value}
                  onChange={(event, value) => {
                    setValue('fuelType', value ? [value] : [], { shouldValidate: true });
                  }}
                  renderTags={(selected, getTagProps) =>
                    selected.map((fuelType, index) => (
                      <Chip
                        {...getTagProps({ index })}
                        key={fuelType}
                        size="small"
                        variant="soft"
                        label={fuelType}
                      />
                    ))
                  }
                />
              </Stack>
            </Stack>
     
            <Stack>
              <Stack>
                <Typography variant="subtitle2" sx={{ mb: 1.5 }}>
                  transmission
                </Typography>

                <RHFAutocomplete
                  name="transmission"
                  multiple={false}
                  placeholder="Select transmission Type"
                  options={['Manual', 'Automatic', 'Semi-Automatic']}
                  getOptionLabel={(option) => option}
                  isOptionEqualToValue={(option, value) => option === value}
                  onChange={(event, value) => {
                    setValue('transmission', value ? [value] : [], { shouldValidate: true });
                  }}
                  renderTags={(selected, getTagProps) =>
                    selected.map((transmission, index) => (
                      <Chip
                        {...getTagProps({ index })}
                        key={transmission}
                        size="small"
                        variant="soft"
                        label={transmission}
                      />
                    ))
                  }
                />
              </Stack>
            </Stack>

            <Stack spacing={1.5}>
              <Typography variant="subtitle2">Available</Typography>
            </Stack>

            <Stack spacing={1.5}>
              <Typography variant="subtitle2">year of Manufacture</Typography>
              <RHFTextField name="yearOfManufacture" placeholder="Ex: yearOfManufacture..." />
            </Stack>
            <Stack spacing={1.5}>
              <Typography variant="subtitle2">Engine Capacity</Typography>
              <RHFTextField name="engineCapacity" placeholder="Ex: 2500CC..." />
            </Stack>
            <Stack spacing={1.5}>
              <Typography variant="subtitle2">Mileage</Typography>
              <RHFTextField name="mileage" placeholder="Ex: 50000" />
            </Stack>
            <Stack spacing={1.5}>
              <Typography variant="subtitle2">Mobile Number</Typography>
              <RHFTextField name="mobileNumber" placeholder="+947145..." />
            </Stack>
            <Stack spacing={1.5}>
              <Typography variant="subtitle2">whatsapp Number</Typography>
              <RHFTextField name="whatsappNumber" placeholder="+947145..." />
            </Stack>

            <Stack spacing={1.5}>
              <Typography variant="subtitle2">Tags</Typography>
              <RHFAutocomplete
                name="tags"
                placeholder="+ Tags"
                multiple
                freeSolo
                options={_tags.map((option) => option)}
                getOptionLabel={(option) => option}
                renderOption={(props, option) => (
                  <li {...props} key={option}>
                    {option}
                  </li>
                )}
                renderTags={(selected, getTagProps) =>
                  selected.map((option, index) => (
                    <Chip
                      {...getTagProps({ index })}
                      key={option}
                      label={option}
                      size="small"
                      color="info"
                      variant="soft"
                    />
                  ))
                }
              />
            </Stack>
          </Stack>
        </Card>
      </Grid>
    </>
  );

  const renderActions = (
    <>
      {mdUp && <Grid md={4} />}
      <Grid xs={12} md={8} sx={{ display: 'flex', alignItems: 'center' }}>
        <FormControlLabel
          control={<Switch defaultChecked />}
          label="Negotiable"
          sx={{ flexGrow: 1, pl: 3 }}
        />

        <LoadingButton
          type="submit"
          variant="contained"
          size="large"
          loading={isSubmitting}
          sx={{ ml: 2 }}
        >
          {!currentTour ? 'Create Tour' : 'Save Changes'}
        </LoadingButton>
      </Grid>
    </>
  );

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        {renderDetails}
        {renderProperties}
        {renderActions}
      </Grid>
    </FormProvider>
  );
}