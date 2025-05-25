import { Dialog, DialogTitle, DialogContent, Grid, Typography, Box, IconButton, Chip, Stack, Button, DialogActions, Alert } from '@mui/material';
import Carousel from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { useState } from 'react';

import { Post, editPost } from 'src/api/post';
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import { useSnackbar } from 'src/components/snackbar';
import { fDateTime } from 'src/utils/format-time';

type Props = {
  post: Post | null;
  open: boolean;
  onClose: () => void;
  onVerificationSuccess?: () => void;
};

export default function PostDetailsDialog({ post, open, onClose, onVerificationSuccess }: Props) {
  const { enqueueSnackbar } = useSnackbar();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!post) return null;

  const handleAccept = async () => {
    try {
      setError(null);
      setIsSubmitting(true);
      const response = await editPost(post.postId, {
        ...post,
        verify: true,
      });

      if (response.success) {
        enqueueSnackbar('Post verified successfully!', { variant: 'success' });
        onVerificationSuccess?.();
        onClose();
      } else {
        // Handle API error response
        const errorMessage = response.error || 'Failed to verify post';
        setError(errorMessage);
        enqueueSnackbar(errorMessage, { variant: 'error' });
      }
    } catch (err: any) {
      // Handle network or unexpected errors
      const errorMessage = err.response?.data?.message || err.message || 'Failed to verify post';
      setError(errorMessage);
      console.error('Error verifying post:', err);
      enqueueSnackbar(errorMessage, { variant: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const carouselSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ pb: 1 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography variant="h4">{post.title}</Typography>
          <IconButton onClick={onClose}>
            <Iconify icon="solar:close-circle-bold" />
          </IconButton>
        </Stack>
      </DialogTitle>

      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Grid container spacing={3}>
          {/* Image Carousel */}
          <Grid item xs={12}>
            <Box sx={{ mb: 3 }}>
              <Carousel {...carouselSettings}>
                {post.images.map((image) => (
                  <Box key={image._id} sx={{ position: 'relative', pt: '56.25%' }}>
                    <Box
                      component="img"
                      src={image.imageUrl}
                      sx={{
                        top: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        position: 'absolute',
                        borderRadius: 1,
                      }}
                    />
                  </Box>
                ))}
              </Carousel>
            </Box>
          </Grid>

          {/* Basic Details */}
          <Grid item xs={12} md={6}>
            <Stack spacing={2}>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Brand
                </Typography>
                <Typography variant="body1">{post.brand}</Typography>
              </Box>

              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Price
                </Typography>
                <Typography variant="body1">{post.price}</Typography>
              </Box>

              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Condition
                </Typography>
                <Label
                  variant="soft"
                  color={post.condition === 'New' ? 'success' : 'warning'}
                >
                  {post.condition}
                </Label>
              </Box>

              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Status
                </Typography>
                <Label
                  variant="soft"
                  color={post.verify ? 'success' : 'error'}
                >
                  {post.verify ? 'Verified' : 'Pending'}
                </Label>
              </Box>
            </Stack>
          </Grid>

          {/* Additional Details */}
          <Grid item xs={12} md={6}>
            <Stack spacing={2}>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Year of Manufacture
                </Typography>
                <Typography variant="body1">{post.yearOfManufacture}</Typography>
              </Box>

              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Mileage
                </Typography>
                <Typography variant="body1">{post.mileage}</Typography>
              </Box>

              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Engine Capacity
                </Typography>
                <Typography variant="body1">{post.engineCapacity}</Typography>
              </Box>

              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Location
                </Typography>
                <Typography variant="body1">{post.city}</Typography>
              </Box>
            </Stack>
          </Grid>

          {/* Features */}
          <Grid item xs={12}>
            <Stack spacing={2}>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Fuel Type
                </Typography>
                <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                  {post.fuelType.map((type) => (
                    <Chip key={type} label={type} size="small" />
                  ))}
                </Stack>
              </Box>

              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Transmission
                </Typography>
                <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                  {post.transmission.map((type) => (
                    <Chip key={type} label={type} size="small" />
                  ))}
                </Stack>
              </Box>

              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Tags
                </Typography>
                <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                  {post.tags.map((tag) => (
                    <Chip key={tag} label={tag} size="small" />
                  ))}
                </Stack>
              </Box>
            </Stack>
          </Grid>

          {/* Description */}
          <Grid item xs={12}>
            <Typography variant="subtitle2" color="text.secondary">
              Description
            </Typography>
            <Typography
              variant="body1"
              dangerouslySetInnerHTML={{ __html: post.description }}
              sx={{ mt: 1 }}
            />
          </Grid>

          {/* Contact Information */}
          <Grid item xs={12}>
            <Stack direction="row" spacing={3}>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Mobile Number
                </Typography>
                <Typography variant="body1">{post.mobileNumber}</Typography>
              </Box>

              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  WhatsApp
                </Typography>
                <Typography variant="body1">{post.whatsappNumber}</Typography>
              </Box>

              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Posted Date
                </Typography>
                <Typography variant="body1">{fDateTime(post.createdAt)}</Typography>
              </Box>
            </Stack>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Close</Button>
        {!post.verify && (
          <Button
            variant="contained"
            color="success"
            onClick={handleAccept}
            disabled={isSubmitting}
            startIcon={<Iconify icon={isSubmitting ? 'solar:loading-bold-duotone' : 'solar:check-circle-bold'} />}
          >
            {isSubmitting ? 'Accepting...' : 'Accept Post'}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
} 