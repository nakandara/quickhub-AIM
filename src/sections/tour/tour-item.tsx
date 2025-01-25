
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { fDateTime } from 'src/utils/format-time';
import { fCurrency } from 'src/utils/format-number';

import Image from 'src/components/image';
import Iconify from 'src/components/iconify';
import { shortDateLabel } from 'src/components/custom-date-range-picker';
import  { usePopover } from 'src/components/custom-popover';

import { AdPost } from 'src/types/tour';
import { Key } from 'react';

// ----------------------------------------------------------------------

type Props = {
  tour: AdPost;
  onView: VoidFunction;
  onEdit: VoidFunction;
  onDelete: VoidFunction;
};



export default function TourItem({ tour, onView, onEdit, onDelete }: Props) {
  const popover = usePopover();
  console.log(tour,'[[[[[[[[[[[[[[');
  const {
    _id,
    images,
    createdAt,
    model,
    mileage,
    fuelType,
    engineCapacity,
    title
    
  } = tour;

  console.log(model,'oooooooooo');
  
 
  
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
        bgcolor: 'warning.lighter',
      }}
    >
      <Iconify icon="eva:star-fill" sx={{ color: 'warning.main', mr: 0.25 }} /> {mileage}
      
    </Stack>
  );

  const renderImages = (
    <Stack
      spacing={0.5}
      direction="row"
      sx={{
        p: (theme) => theme.spacing(1, 1, 0, 1),
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
        p: (theme) => theme.spacing(2.5, 2.5, 2, 2.5),
      }}
      primary={`Posted date: ${fDateTime(createdAt)}`}
      secondary={
        <Link component={RouterLink} href={paths.dashboard.tour.details(_id)} color="inherit">
          {model} { title}
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
        p: (theme) => theme.spacing(0, 2.5, 2.5, 2.5),
      }}
    >
    <IconButton onClick={popover.onOpen} aria-label="More actions">
  <Iconify icon="eva:more-vertical-fill" />
</IconButton>


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
    label: `${images.length} Booked`,
    icon: <Iconify icon="solar:users-group-rounded-bold" sx={{ color: 'primary.main' }} />,
  },
]
.map((item) => (
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


    </>
  );
}
