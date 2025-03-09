import { m } from 'framer-motion';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import ListItemText from '@mui/material/ListItemText';

import Image from 'src/components/image';
import Iconify from 'src/components/iconify';
import Markdown from 'src/components/markdown';
import { varTranHover } from 'src/components/animate';
import Lightbox, { useLightBox } from 'src/components/lightbox';

type Props = {
  tour: any; // Replace with the specific type if available
};

export default function TourDetailsContent({ tour }: Props) {
  const {
    title = '',
    images = [],
    description = '',
    brand = '',
    model = '',
    plane = '',
    bodyType = '',
    category = '',
    city = '',
    createdAt = '',
    mobileNumber = '',
    price = '',
    yearOfManufacture = '',
    ratingNumber = '',
    transmission = '',
  } = tour || {};

  const slides = images?.map((image: any) => ({ src: image.imageUrl })) || [];

  const { selected: selectedImage, open: openLightbox, onOpen: handleOpenLightbox, onClose: handleCloseLightbox } = useLightBox(slides);

  const renderGallery = slides.length > 0 ? (
    <>
      <Box
        gap={1}
        display="grid"
        gridTemplateColumns={{
          xs: 'repeat(1, 1fr)',
          md: 'repeat(2, 1fr)',
        }}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      >
        <m.div
          key={slides[0].src}
          whileHover="hover"
          variants={{
            hover: { opacity: 0.8 },
          }}
          transition={varTranHover()}
        >
          <Image
            alt={slides[0].src}
            src={slides[0].src}
            ratio="1/1"
            onClick={() => handleOpenLightbox(slides[0].src)}
            sx={{ borderRadius: 2, cursor: 'pointer' }}
          />
        </m.div>

        <Box gap={1} display="grid" gridTemplateColumns="repeat(2, 1fr)">
          {slides.slice(1, 5).map((slide: any) => (
            <m.div
              key={slide.src}
              whileHover="hover"
              variants={{
                hover: { opacity: 0.8 },
              }}
              transition={varTranHover()}
            >
              <Image
                alt={slide.src}
                src={slide.src}
                ratio="1/1"
                onClick={() => handleOpenLightbox(slide.src)}
                sx={{ borderRadius: 2, cursor: 'pointer' }}
              />
            </m.div>
          ))}
        </Box>
      </Box>

      <Lightbox
        index={selectedImage}
        slides={slides}
        open={openLightbox}
        close={handleCloseLightbox}
      />
    </>
  ) : null;

  const renderHead = (
    <>
      <Stack direction="row" sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ flexGrow: 1 }}>{title}</Typography>
        <IconButton><Iconify icon="solar:share-bold" /></IconButton>
        <Checkbox defaultChecked color="error" icon={<Iconify icon="solar:heart-outline" />} checkedIcon={<Iconify icon="solar:heart-bold" />} />
      </Stack>
      <Stack spacing={3} direction="row" alignItems="center">
        <Stack direction="row" alignItems="center" spacing={0.5} sx={{ typography: 'body2' }}>
          <Iconify icon="eva:star-fill" sx={{ color: 'warning.main' }} />
          <Box component="span" sx={{ typography: 'subtitle2' }}>{plane}</Box>
        </Stack>
        <Stack direction="row" alignItems="center" spacing={0.5} sx={{ typography: 'body2' }}>
          <Iconify icon="mingcute:location-fill" sx={{ color: 'error.main' }} />
          {city}
        </Stack>
      </Stack>
    </>
  );

  const renderOverview = (
    <Box display="grid" gridTemplateColumns="repeat(2, 1fr)">
      {[
        { label: 'Price', value: price, icon: <Iconify icon="solar:money-bag-bold" /> },
        { label: 'Body Type', value: bodyType, icon: <Iconify icon="solar:car-bold" /> },
        { label: 'Year of Manufacture', value: yearOfManufacture, icon: <Iconify icon="solar:calendar-date-bold" /> },
        { label: 'Transmission', value: transmission, icon: <Iconify icon="solar:gear-bold" /> },
      ].map((item) => (
        <Stack key={item.label} spacing={1.5} direction="row">
          {item.icon}
          <ListItemText
            primary={item.label}
            secondary={item.value}
            primaryTypographyProps={{ typography: 'body2', color: 'text.secondary', mb: 0.5 }}
            secondaryTypographyProps={{ typography: 'subtitle2', color: 'text.primary', component: 'span' }}
          />
        </Stack>
      ))}
    </Box>
  );

  const renderContent = (
    <>
      <Markdown children={description} />
      <Stack spacing={2}>
        <Typography variant="h6">Contact Information</Typography>
        <Box>{mobileNumber}</Box>
      </Stack>
    </>
  );

  return (
    <>
      {renderGallery}

      <Stack sx={{ maxWidth: 720, mx: 'auto' }}>
        {renderHead}

        <Divider sx={{ borderStyle: 'dashed', my: 5 }} />

        {renderOverview}

        <Divider sx={{ borderStyle: 'dashed', my: 5 }} />

        {renderContent}
      </Stack>
    </>
  );
}