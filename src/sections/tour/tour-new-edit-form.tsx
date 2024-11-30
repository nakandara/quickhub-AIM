import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, Controller } from 'react-hook-form';
import { useMemo, useEffect, useCallback } from 'react';

import Chip from '@mui/material/Chip';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Switch from '@mui/material/Switch';
import Grid from '@mui/material/Unstable_Grid2';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import FormControlLabel from '@mui/material/FormControlLabel';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useResponsive } from 'src/hooks/use-responsive';

import { countries } from 'src/assets/data';
import { _tags, _tourGuides, TOUR_SERVICE_OPTIONS } from 'src/_mock';

import { useSnackbar } from 'src/components/snackbar';
import FormProvider, {
  RHFEditor,
  RHFUpload,
  RHFTextField,
  RHFAutocomplete,
  RHFMultiCheckbox,
} from 'src/components/hook-form';

import { ITourItem, ITourGuide } from 'src/types/tour';
import { useMockedUser } from 'src/hooks/use-mocked-user';
import { createPost } from 'src/api/post';

// ----------------------------------------------------------------------

type Props = {
  currentTour?: ITourItem;
};

type FormValues = {
  title: string;
  content: string;
  images: File[];
  tourGuides: ITourGuide[];
  tags: string[];
  durations: string;
  destination: string;
  services: string[];
  available: {
    startDate: Date | null;
    endDate: Date | null;
  };
};



export default function TourNewEditForm({ currentTour }: any) {
  const router = useRouter();
  const { user } = useMockedUser();
  console.log(user?._id,'pppppppppppppp');
  

  const mdUp = useResponsive('up', 'md');

  const { enqueueSnackbar } = useSnackbar();

  const NewTourSchema = Yup.object().shape({
    userId: Yup.string().required('User ID is required'),
    title: Yup.string().required('Title is required'),
    bodyType: Yup.string().required('Body Type is required'),
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
      .matches(/^\d+$/, 'Mileage must be a number'), // Ensure it is numeric
    tags: Yup.array().of(Yup.string()).min(2, 'Must have at least 2 tags'),
    services: Yup.array().of(Yup.string()).min(2, 'Must have at least 2 services'),
    destination: Yup.string().required('Destination is required'),
    available: Yup.object().shape({
      startDate: Yup.date()
        .nullable()
        .required('Start date is required'),
      endDate: Yup.date()
        .nullable()
        .required('End date is required')
        .min(Yup.ref('startDate'), 'End date must be later than start date'),
    }),
  });
  
  
  const defaultValues = useMemo(
    () => ({
      userId: user?._id || '',
      title: currentTour?.title || '',
      price: currentTour?.price || '',
      bodyType: currentTour?.bodyType || '',
      description: currentTour?.content || '',
      images: currentTour?.images || [],
      fuelType: currentTour?.fuelType || [],
      transmission: currentTour?.transmission || [],
      tags: currentTour?.tags || [],
      yearOfManufacture: currentTour?.durations || '',
      engineCapacity: currentTour?.engineCapacity || '',
      mileage: currentTour?.mileage || '', // New field
      destination: currentTour?.destination || '',
      services: currentTour?.services || [],
      available: {
        startDate: currentTour?.available?.startDate || null,
        endDate: currentTour?.available?.endDate || null,
      },
    }),
    [currentTour, user]
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
    console.log(data,'------------------');
    
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      reset();
      enqueueSnackbar(currentTour ? 'Update success!' : 'Create success!');
      createPost(data)
      router.push(paths.dashboard.tour.root);
      console.info('DATA', data);
    } catch (error) {
      console.error(error);
    }
  });

  const handleDrop = useCallback(
    (acceptedFiles: File[]) => {
      const files = values.images || [];

      const newFiles = acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      );

      setValue('images', [...files, ...newFiles], { shouldValidate: true });
    },
    [setValue, values.images]
  );

  const handleRemoveFile = useCallback(
    (inputFile: File | string) => {
      const filtered = values.images && values.images?.filter((file:any) => file !== inputFile);
      setValue('images', filtered);
    },
    [setValue, values.images]
  );

  const handleRemoveAllFiles = useCallback(() => {
    setValue('images', []);
  }, [setValue]);

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
              <Typography variant="subtitle2">Images</Typography>
              <RHFUpload
                multiple
                thumbnail
                name="images"
                maxSize={3145728}
                onDrop={handleDrop}
                onRemove={handleRemoveFile}
                onRemoveAll={handleRemoveAllFiles}
                onUpload={() => console.info('ON UPLOAD')}
              />
            </Stack>
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
  multiple={false} // Allow single selection
  placeholder="Select Fuel Type"
  options={['Petrol', 'Diesel']}
  getOptionLabel={(option) => option}
  isOptionEqualToValue={(option, value) => option === value}
  onChange={(event, value) => {
    setValue('fuelType', value ? [value] : [], { shouldValidate: true }); // Convert to array
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
  multiple={false} // Allow single selection
  placeholder="Select transmission Type"
  options={['Manual', 'Automatic','Semi-Automatic']}
  getOptionLabel={(option) => option}
  isOptionEqualToValue={(option, value) => option === value}
  onChange={(event, value) => {
    setValue('transmission', value ? [value] : [], { shouldValidate: true }); // Convert to array
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
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                <Controller
                  name="available.startDate"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <DatePicker
                      {...field}
                      format="dd/MM/yyyy"
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          error: !!error,
                          helperText: error?.message,
                        },
                      }}
                    />
                  )}
                />
                <Controller
                  name="available.endDate"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <DatePicker
                      {...field}
                      format="dd/MM/yyyy"
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          error: !!error,
                          helperText: error?.message,
                        },
                      }}
                    />
                  )}
                />
              </Stack>
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
              <Typography variant="subtitle2">Destination</Typography>
              <RHFAutocomplete
                name="destination"
                type="country"
                placeholder="+ Destination"
                options={countries.map((option) => option.label)}
                getOptionLabel={(option) => option}
              />
            </Stack>

            <Stack spacing={1}>
              <Typography variant="subtitle2">Services</Typography>
              <RHFMultiCheckbox
                name="services"
                options={TOUR_SERVICE_OPTIONS}
                sx={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                }}
              />
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
          label="Publish"
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
