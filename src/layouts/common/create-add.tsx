import React, { useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent,useMediaQuery, DialogTitle, MenuItem, Select, FormControl, InputLabel, IconButton, Tooltip } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import Iconify from 'src/components/iconify';
import { useTheme } from '@mui/material/styles';
import { paths } from 'src/routes/paths';

export default function CreateAdd() {
  const [open, setOpen] = useState(false);
  const [city, setCity] = useState('');
  const [category, setCategory] = useState('');
  const navigate = useNavigate();
  const location = useLocation(); // Get the current location

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // Detect screen size

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleNext = () => {
    if (city && category) {
      handleClose();
      navigate(paths.dashboard.posts.new);
    } else {
      alert('Please select both city and category');
    }
  };

  // Hide the button if the current route is '/dashboard/tour/new'
  if (location.pathname === paths.dashboard.posts.new) {
    return null;
  }

  return (
    <>
      {isMobile ? (
        <Tooltip title="Create Your Post">
          <IconButton
            color="primary"
            onClick={handleOpen}
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
          onClick={handleOpen}
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

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>Select Details</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="normal">
            <InputLabel>City</InputLabel>
            <Select value={city} onChange={(e) => setCity(e.target.value)} fullWidth>
              <MenuItem value="Colombo">Colombo</MenuItem>
              <MenuItem value="Kandy">Kandy</MenuItem>
              <MenuItem value="Galle">Galle</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth margin="normal">
            <InputLabel>Category</InputLabel>
            <Select value={category} onChange={(e) => setCategory(e.target.value)} fullWidth>
              <MenuItem value="Car">Car</MenuItem>
              <MenuItem value="Bike">Bike</MenuItem>
              <MenuItem value="Truck">Truck</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleNext} variant="contained" color="primary">
            Next
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
