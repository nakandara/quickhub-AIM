import { useNavigate, useLocation } from 'react-router-dom';
import { Button, Tooltip, IconButton, useMediaQuery } from '@mui/material';
import Iconify from 'src/components/iconify';
import { useTheme } from '@mui/material/styles';
import { paths } from 'src/routes/paths';
import { useGetOtp } from 'src/api/otp';
import { useMockedUser } from 'src/hooks/use-mocked-user';


export default function CreateAdd() {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const { user } = useMockedUser();
  const userId = user?.userId; // Ensure userId is available

  // Fetch OTP data
  const { otpData, otpDataLoading } = useGetOtp(userId);
  

  // Check if the user is verified
  const isVerified = otpData?.some((otp: { veryOTP: any; }) => otp.veryOTP);

  const handleNavigate = () => {
  
    
    if (!userId) {
      navigate(paths.auth.amplify.login); // Redirect to login if userId is missing
      return;
    }
  
    if (isVerified) {
      navigate(paths.dashboard.posts.category);
    } else {
      navigate(paths.authDemo.modern.otp);
    }
  };
  

  // Hide button if current route is '/dashboard/posts/category'
  if (location.pathname === paths.dashboard.posts.category) {
    return null;
  }

  const pathSegments = location.pathname.split("/");
  const postId = pathSegments[pathSegments.length - 1];

  if (["vehicles", "properties"].includes(postId)) {
    return null;
  }

  return (
    <>
      {isMobile ? (
        <Tooltip title="Create Your Post">
          <IconButton
            color="primary"
            onClick={handleNavigate}
            sx={{ padding: '8px' }}
            disabled={otpDataLoading} // Disable while loading
          >
            <Iconify icon="mingcute:add-line" fontSize="24px" />
          </IconButton>
        </Tooltip>
      ) : (
        <Button
          variant="contained"
          color="primary"
          onClick={handleNavigate}
          startIcon={<Iconify icon="mingcute:add-line" />}
          sx={{
            padding: { xs: '6px 10px', sm: '10px 20px', md: '12px 24px' },
            fontSize: { xs: '10px', sm: '14px', md: '16px' },
            borderRadius: '8px',
            textTransform: 'none',
          }}
          disabled={otpDataLoading} // Disable while loading
        >
          Create Your Post
        </Button>
      )}
    </>
  );
}
