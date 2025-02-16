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
import { useNavigate,useLocation } from 'react-router-dom';

import Modal from '@mui/material/Modal';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import { useState } from 'react';


// ----------------------------------------------------------------------

type Props = {
  user: IUserCard;
  onClick: () => void; // Add onClick prop
};

const modalStyle = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
};


export default function PlaneCard({ user,onClick }: Props) {
  const theme = useTheme();
  const navigate = useNavigate();
  const locationP = useLocation();  
  
  const lastSegment = locationP.pathname.split('/').pop(); 

  console.log('Last URL Segment:', lastSegment); // This will log 'vehicles'
  const { name, coverUrl, role, totalFollowers, totalPosts, avatarUrl, totalFollowing } = user;

  
  const [open, setOpen] = useState(false);
  const [vehicle, setVehicle] = useState('');
  const [location, setLocation] = useState('');
  const [subLocation, setSubLocation] = useState('');

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  

  const handleCreatePost = () => {
    navigate(`/dashboard/posts/new/${lastSegment}/${vehicle}/${location}/${subLocation}`);
  }

  const vehicleTypes = [
    "Car", "Bike", "Truck", "Bus", "Van", "SUV", "Pickup", "Tractor", 
    "Jeep", "Lorry", "Motorcycle", "Scooter", "Minivan", "Convertible",
    "Coupe", "Hatchback", "Sedan", "Wagon", "Electric", "Hybrid"
  ];
  
  return (
    <>
      {/* Existing Card Component */}
      <Card onClick={handleOpen} sx={{ textAlign: 'center' }}>
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
        secondary={role}
        primaryTypographyProps={{ typography: 'subtitle1' }}
        secondaryTypographyProps={{ component: 'span', mt: 0.5 }}
      />

      <Stack direction="row" alignItems="center" justifyContent="center" sx={{ mb: 2.5 }}>
        {_socials.map((social) => (
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
        ))}
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

      {/* Popup Modal */}
      <Modal open={open} onClose={handleClose}>
        <Box sx={modalStyle}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Select Details
          </Typography>

          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Select a Vehicle</InputLabel>
            <Select value={vehicle} onChange={(e) => setVehicle(e.target.value)}>
              <MenuItem value="Car">Car</MenuItem>
              <MenuItem value="Bike">Bike</MenuItem>
              <MenuItem value="Truck">Truck</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Select a Location</InputLabel>
            <Select value={location} onChange={(e) => setLocation(e.target.value)}>
              <MenuItem value="Colombo">Colombo</MenuItem>
              <MenuItem value="Kandy">Kandy</MenuItem>
              <MenuItem value="Galle">Galle</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Select a Sub-Location</InputLabel>
            <Select value={subLocation} onChange={(e) => setSubLocation(e.target.value)}>
              <MenuItem value="Central">Central</MenuItem>
              <MenuItem value="North">North</MenuItem>
              <MenuItem value="South">South</MenuItem>
            </Select>
          </FormControl>

          <Button variant="contained" onClick={handleCreatePost}>
            Next
          </Button>
        </Box>
      </Modal>
    </>
  );
}
