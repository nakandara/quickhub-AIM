import React, { useState } from 'react';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';
import { useTheme } from '@mui/material/styles';
import { fDateTime } from 'src/utils/format-time';
import { fCurrency } from 'src/utils/format-number';
import { useLocation } from 'react-router';
import Image from 'src/components/image';
import Iconify from 'src/components/iconify';
import { shortDateLabel } from 'src/components/custom-date-range-picker';

import { AdPost } from 'src/types/tour';
import { deletePost } from 'src/api/post';

type Props = {
  tour: AdPost;
  onView: VoidFunction;
  onEdit: VoidFunction;
  onDelete: (postId: string) => void; // Add onDelete prop
};

export default function TourItem({ tour, onView, onEdit, onDelete }: Props) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const location = useLocation();
  const currentPath = location.pathname.split('/').pop();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false); // State for delete confirmation modal

  const {
    _id,
    images,
    createdAt,
    model,
    mileage,
    fuelType,
    engineCapacity,
    title,
    userId,
    postId,
    verify
  } = tour;

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

const theme = useTheme();

  let bgColor;
  if (verify) {
    bgColor = theme.palette.mode === 'dark' ? 'success.dark' : 'success.lighter';
  } else {
    bgColor = theme.palette.mode === 'dark' ? 'warning.dark' : 'warning.lighter';
  }

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true); // Open the delete confirmation modal
    handleMenuClose(); // Close the menu
  };

  const handleDeleteConfirm = async () => {
    const response = await deletePost(userId, postId);
    if (response.success) {
      onDelete(postId); // Call the onDelete callback to update the parent state
    } else {
      console.error('Error deleting post:', response.error);
    }
    setDeleteDialogOpen(false); // Close the modal after deletion
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false); // Close the modal without deleting
  };

  const renderRating = (
    <Stack
    direction="row"
    alignItems="center"
    sx={{
      top: 8,
      right: 8,
      zIndex: 9,
      borderRadius: 1,
      position: 'absolute',
      p: '2px 6px 2px 4px',
      typography: 'subtitle2',
      bgcolor: bgColor, // Use the precomputed color variable
    }}
  >
    <Iconify
      icon={verify ? 'eva:checkmark-circle-2-fill' : 'eva:clock-outline'}
      sx={{ color: verify ? 'success.main' : 'warning.main', mr: 0.25 }}
    />
    {verify ? 'Verified' : 'Pending'}
  </Stack>
  );

  const renderImages = (
    <Stack
      spacing={0.5}
      direction="row"
      sx={{
        p: (spacingTheme) => spacingTheme.spacing(1, 1, 0, 1),
      }}
    >
      <Stack flexGrow={1} sx={{ position: 'relative' }}>
        {fuelType}
        {renderRating}
        <Image
          alt={images[0]?.imageUrl}
          src={images[0]?.imageUrl}
          sx={{ borderRadius: 1, height: 164, width: 1 }}
        />
      </Stack>
      <Stack spacing={0.5}>
        {images.slice(1, 3).map((img, idx) => (
          <Image
            key={img.imageUrl || idx}
            alt={img.imageUrl || `Image-${idx}`}
            src={img.imageUrl}
            ratio="1/1"
            sx={{ borderRadius: 1, width: 80 }}
          />
        ))}
      </Stack>
    </Stack>
  );

  const renderTexts = (
    <ListItemText
      sx={{
        p: (spacingTheme) => spacingTheme.spacing(2.5, 2.5, 2, 2.5),
      }}
      primary={`Posted date: ${fDateTime(createdAt)}`}
      secondary={
        <Link component={RouterLink} href={paths.dashboard.tour.details(_id)} color="inherit">
          {model} {title}
        </Link>
      }
      primaryTypographyProps={{
        typography: 'caption',
        color: 'text.disabled',
      }}
      secondaryTypographyProps={{
        mt: 1,
        noWrap: true,
        component: 'span',
        color: 'text.primary',
        typography: 'subtitle1',
      }}
    />
  );

  const renderInfo = (
    <Stack
      spacing={1.5}
      sx={{
        position: 'relative',
        p: (spacingTheme) => spacingTheme.spacing(0, 2.5, 2.5, 2.5),
      }}
    >
      {/* Conditionally render the IconButton and Menu */}
      {!currentPath?.includes('posts') && (
        <>
          <IconButton
            onClick={handleMenuOpen}
            aria-label="More actions"
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
            }}
          >
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={() => { onEdit(); handleMenuClose(); }}>Edit</MenuItem>
            <MenuItem onClick={handleDeleteClick}>Delete</MenuItem> {/* Open delete confirmation modal */}
          </Menu>
        </>
      )}

      {[
        {
          label: `Capacity: ${engineCapacity}`,
          icon: <Iconify icon="mingcute:location-fill" sx={{ color: 'error.main' }} />,
        },
        {
          label: `Fuel Type: ${fuelType}`,
          icon: <Iconify icon="solar:clock-circle-bold" sx={{ color: 'info.main' }} />,
        },
        {
          label: `${images.length} Images`,
          icon: (
            <Iconify
              icon="material-symbols:photo"
              width={24}
              sx={{ color: 'primary.main' }}
            />
          ),
        }
      ].map((item) => (
        <Stack
          key={item.label}
          spacing={1}
          direction="row"
          alignItems="center"
          sx={{ typography: 'body2' }}
        >
          {item.icon}
          {item.label}
        </Stack>
      ))}
    </Stack>
  );

  return (
    <>
      <Card>
        {renderImages}
        {renderTexts}
        {renderInfo}
      </Card>

      {/* Delete Confirmation Modal */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">Delete Post</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this post? This action cannot be undone.
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}