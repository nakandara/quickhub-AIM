import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { EmailInboxIcon } from 'src/assets/icons';

import Iconify from 'src/components/iconify';
import FormProvider, { RHFCode, RHFTextField } from 'src/components/hook-form';
import { useSendOtp, useVerifyOtp } from 'src/api/otp';
import { useMockedUser } from 'src/hooks/use-mocked-user';
import { useSnackbar } from 'src/components/snackbar';
import { useNavigate } from 'react-router-dom';

// ----------------------------------------------------------------------

export default function ModernVerifyOtpView() {
  const VerifySchema = Yup.object().shape({
    code: Yup.string().min(6, 'Code must be at least 6 characters').required('Code is required'),
    phoneNumber: Yup.string()
    .required('Phone number is required')
    .matches(
      /^\+[1-9]\d{1,14}$/, // Matches international phone numbers with a country code
      'Phone number must be a valid international number (e.g., +94715297881)'
    ),
  });

  const { enqueueSnackbar } = useSnackbar();
  const defaultValues = {
    code: '',
    phoneNumber: '',
  };

  const { user } = useMockedUser();
  const methods = useForm({
    mode: 'onChange',
    resolver: yupResolver(VerifySchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
    watch,
  } = methods;

  const phoneNumber = watch('phoneNumber'); // Watch the phone number input value
  const navigate = useNavigate();
  // Use the custom hooks for OTP API integration
  const { sendOtp, isSendingOtp, sendOtpError } = useSendOtp();
  const { verifyOtp, isVerifyingOtp, verifyOtpError } = useVerifyOtp();

  // Handle sending OTP
  const handleSendOtp = async () => {
    try {
      await sendOtp({ phoneNumber });

      console.log('OTP sent successfully');
    } catch (error) {
      console.error('Error sending OTP:', error);
    }
  };

  const onSubmit = handleSubmit(async (data) => {
    console.log(user?.userId, 'ppppppppppppp');
  
    try {
      const { code, phoneNumber: submittedPhoneNumber } = data;
      
      // Call the API and wait for the response
      const response = await verifyOtp({ 
        phoneNumber: submittedPhoneNumber, 
        otp: code, 
        userId: user?.userId 
      });
  
      // Check if the response contains the success message
      if (response?.message === 'OTP verified successfully') {
        enqueueSnackbar('OTP verified successfully!', { variant: 'success' });
  
        // Navigate to the dashboard/posts/category route
        navigate('/dashboard/posts/category');
      } else {
        enqueueSnackbar(response?.message || 'OTP verification failed', { variant: 'error' });
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
  
      // Show error message
      enqueueSnackbar(error.response?.data?.message || 'Error verifying OTP. Please try again.', { variant: 'error' });
    }
  });
  

  const renderForm = (
    <Stack spacing={3} alignItems="center">
      <RHFTextField
        name="phoneNumber"
        label="Phone Number"
        placeholder="+947152...."
        InputLabelProps={{ shrink: true }}
      />

      <LoadingButton
        fullWidth
        size="small"
        type="button" // Change to "button" to prevent form submission
        variant="contained"
        loading={isSendingOtp}
        onClick={handleSendOtp} // Trigger OTP sending
      >
        Send OTP
      </LoadingButton>

      <Typography variant="body2">
        {`Don’t have a code? `}
        <Link
          variant="subtitle2"
          sx={{
            cursor: 'pointer',
          }}
          onClick={handleSendOtp} // Allow resending OTP
        >
          Resend code
        </Link>
      </Typography>

      <RHFCode name="code" />

      <LoadingButton
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        loading={isVerifyingOtp}
      >
        Verify
      </LoadingButton>

      <Link
        component={RouterLink}
        href={paths.dashboard.root}
        color="inherit"
        variant="subtitle2"
        sx={{
          alignItems: 'center',
          display: 'inline-flex',
        }}
      >
        <Iconify icon="eva:arrow-ios-back-fill" width={16} />
        Return to sign in
      </Link>
    </Stack>
  );

  const renderHead = (
    <>
      <EmailInboxIcon sx={{ height: 96 }} />

      <Stack spacing={1} sx={{ mt: 3, mb: 5 }}>
        <Typography variant="h3">Please check your phone!</Typography>

        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          We have sent a 6-digit confirmation code to your phone number, please enter the code in the
          box below to verify your phone number.
        </Typography>
      </Stack>
    </>
  );

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      {renderHead}

      {renderForm}
    </FormProvider>
  );
}