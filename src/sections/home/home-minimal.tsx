import { m } from 'framer-motion';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import { alpha } from '@mui/material/styles';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { varFade, MotionViewport } from 'src/components/animate';

// ----------------------------------------------------------------------

const CARDS = [
  {
    icon: ' /assets/icons/home/ic_make_brand.svg',
    title: 'Signup',
    description: 'පලමුව ඔබ Account එකක් නිර්මාණය කර එයින් log වෙන්න.First, create an account and log in.',
  },
  {
    icon: ' /assets/icons/home/ic_design.svg',
    title: 'Verification',
    description:
      'ඔබගේ දුරකථන අංකය යොදා account එක verify කරගන්න.Verify the account using your phone number.',
  },
  {
    icon: ' /assets/icons/home/ic_development.svg',
    title: 'Creating Advertisement',
    description: 'ඔබගේ Advertisement එක නිර්මාණය කිරීම,Creating Your Advertisement',
  },
  {
    icon: ' /assets/icons/home/ic_development.svg',
    title: 'Payments',
    description: 'ගෙවීම් (PAYMENT) සිදු කිරීම.Making payment (PAYMENT).',
  },
];

// ----------------------------------------------------------------------

export default function HomeMinimal() {
  return (
    <Container
      component={MotionViewport}
      sx={{
        py: { xs: 10, md: 15 },
      }}
    >
      <Stack
        spacing={3}
        sx={{
          textAlign: 'center',
          mb: { xs: 5, md: 10 },
        }}
      >
        <m.div variants={varFade().inUp}>
          <Typography component="div" variant="overline" sx={{ color: 'text.disabled' }}>
            Minimal UI
          </Typography>
        </m.div>

        <m.div variants={varFade().inDown}>
          <Typography variant="h2">
           Quick Ads Hub   <br /> Steps
          </Typography>
        </m.div>
      </Stack>

      <Box
        gap={{ xs: 3, lg: 10 }}
        display="grid"
        alignItems="center"
        gridTemplateColumns={{
          xs: 'repeat(1, 1fr)',
          md: 'repeat(3, 1fr)',
        }}
      >
        {CARDS.map((card, index) => (
          <m.div variants={varFade().inUp} key={card.title}>
            <Card
           sx={{
            textAlign: 'center',
            bgcolor: 'background.default',
            p: (theme) => theme.spacing(10, 5),
            boxShadow: (theme) => ({
              md: `-40px 40px 80px ${
                theme.palette.mode === 'light'
                  ? alpha(theme.palette.grey[500], 0.16)
                  : alpha(theme.palette.common.black, 0.4)
              }`,
            }),
          }}
          
            >
              <Box
                component="img"
                src={card.icon}
                alt={card.title}
                sx={{ mx: 'auto', width: 48, height: 48 }}
              />

              <Typography variant="h5" sx={{ mt: 8, mb: 2 }}>
                {card.title}
              </Typography>

              <Typography sx={{ color: 'text.secondary' }}>{card.description}</Typography>
            </Card>
          </m.div>
        ))}
      </Box>
    </Container>
  );
}
