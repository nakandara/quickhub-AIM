import { useNavigate, useLocation } from 'react-router-dom';
import { Button,Tooltip, IconButton, useMediaQuery } from '@mui/material';
import Iconify from 'src/components/iconify';
import { useTheme } from '@mui/material/styles';
import { paths } from 'src/routes/paths';

export default function CreateAdd() {
  const navigate = useNavigate();
  const location = useLocation(); // Get the current location
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // Detect screen size

  const handleNavigate = () => {
    navigate(paths.dashboard.posts.category);
  };

  // Hide the button if the current route is '/dashboard/posts/new'
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
            sx={{
              padding: '8px',
            }}
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
        >
          Create Your Post
        </Button>
      )}
    </>
  );
}
