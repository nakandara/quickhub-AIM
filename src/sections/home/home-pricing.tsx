import { m } from 'framer-motion';
import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import { alpha } from '@mui/material/styles';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Stack, { StackProps } from '@mui/material/Stack';

import { paths } from 'src/routes/paths';

import { useResponsive } from 'src/hooks/use-responsive';

import { _homePlans } from 'src/_mock';

import Iconify from 'src/components/iconify';
import { varFade, MotionViewport } from 'src/components/animate';
import { FormControl, InputLabel, MenuItem, Modal, Select } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';

// ----------------------------------------------------------------------

export default function HomePricing() {
  const mdUp = useResponsive('up', 'md');

  const [currentTab, setCurrentTab] = useState('Standard');

  

  

  const handleChangeTab = useCallback((event: React.SyntheticEvent, newValue: string) => {
    setCurrentTab(newValue);
  }, []);

  const renderDescription = (
    <Stack spacing={3} sx={{ mb: 10, textAlign: 'center' }}>
      <m.div variants={varFade().inUp}>
        <Typography component="div" variant="overline" sx={{ mb: 2, color: 'text.disabled' }}>
          Advertisement Plans
        </Typography>
      </m.div>
  
      <m.div variants={varFade().inDown}>
        <Typography variant="h2">
          The Right Plan for <br /> Your Vehicle and Property Ads
        </Typography>
      </m.div>
  
      <m.div variants={varFade().inDown}>
        <Typography sx={{ color: 'text.secondary' }}>
          Boost your vehicle and property sales with premium listings, featured ads, and flexible plans tailored to your needs.
        </Typography>
      </m.div>
  

  
      <m.div variants={varFade().inUp}>
        <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 3 }}>
          <Iconify icon="mdi:car" width={40} height={40} />
          <Iconify icon="mdi:home" width={40} height={40} />
        </Stack>
      </m.div>
    </Stack>
  );

  const renderContent = (
    <>
      {mdUp ? (
        <Box
          display="grid"
          gridTemplateColumns="repeat(3, 1fr)"
          sx={{
            borderRadius: 2,
            border: (theme) => `dashed 1px ${theme.palette.divider}`,
          }}
        >
          {_homePlans.map((plan) => (
            <m.div key={plan.license} variants={varFade().in}>
              <PlanCard key={plan.license} plan={plan} />
            </m.div>
          ))}
        </Box>
      ) : (
        <>
          <Stack alignItems="center" sx={{ mb: 5 }}>
            <Tabs value={currentTab} onChange={handleChangeTab}>
              {_homePlans.map((tab) => (
                <Tab key={tab.license} value={tab.license} label={tab.license} />
              ))}
            </Tabs>
          </Stack>

          <Box
            sx={{
              borderRadius: 2,
              border: (theme) => `dashed 1px ${theme.palette.divider}`,
            }}
          >
            {_homePlans.map(
              (tab) =>
                tab.license === currentTab && (
                  <PlanCard
                    key={tab.license}
                    plan={tab}
                    sx={{
                      borderLeft: (theme) => `dashed 1px ${theme.palette.divider}`,
                    }}
                  />
                )
            )}
          </Box>
        </>
      )}

      <m.div variants={varFade().in}>
        <Box
          sx={{
            textAlign: 'center',
            mt: {
              xs: 5,
              md: 10,
            },
          }}
        >
          <m.div variants={varFade().inDown}>
            <Typography variant="h4">Still have questions?</Typography>
          </m.div>

          <m.div variants={varFade().inDown}>
            <Typography sx={{ mt: 2, mb: 5, color: 'text.secondary' }}>
              Please describe your case to receive the most accurate advice.
            </Typography>
          </m.div>

          <m.div variants={varFade().inUp}>
            <Button
              color="inherit"
              size="large"
              variant="contained"
              href="mailto:quickadshub@gmail.com?subject=[Feedback] from Customer"
            >
              Contact us
            </Button>
          </m.div>
        </Box>
      </m.div>
    </>
  );

  return (
    <Box
      sx={{
        py: { xs: 10, md: 15 },
        bgcolor: (theme) => alpha(theme.palette.grey[500], 0.04),
      }}
    >
      <Container component={MotionViewport}>
        {renderDescription}

        {renderContent}
      </Container>
    </Box>
  );
}

// ----------------------------------------------------------------------

interface PlanCardProps extends StackProps {
  plan: {
    license: string;
    commons: string[];
    options: string[];
    icons: string[];
    prise: string[];
  };
}

function PlanCard({ plan, sx, ...other }: PlanCardProps) {
  const { license, commons, options, icons,prise } = plan;
  const locationP = useLocation();
  const navigate = useNavigate();
  const lastSegment = locationP.pathname.split('/').pop();
  const standardLicense = license === 'Standard';
  const [vehicle, setVehicle] = useState('');
  const [open, setOpen] = useState(false);
  const [location, setLocation] = useState<string>("");
  const [subLocation, setSubLocation] = useState<string>("");
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleCreatePost = () => {
    navigate(`/dashboard/posts/new/${lastSegment}/${vehicle}/${location}/${subLocation}`);
  }


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

  const plus = license === 'Standard Plus';

  const vehicleTypes = [
    "Car", "Bike", "Truck", "Bus", "Van", "SUV", "Pickup", "Tractor",
    "Jeep", "Lorry", "Motorcycle", "Scooter", "Minivan", "Convertible",
    "Coupe", "Hatchback", "Sedan", "Wagon", "Electric", "Hybrid"
  ];

  const subLocations = {
    'Colombo': [
      "Angoda", "Athurugiriya", "Avissawella", "Battaramulla", "Boralesgamuwa",
      "Colombo 1", "Colombo 2", "Colombo 3", "Colombo 4", "Colombo 5",
      "Colombo 6", "Colombo 7", "Colombo 8", "Colombo 9", "Colombo 10",
      "Colombo 11", "Colombo 12", "Colombo 13", "Colombo 14", "Colombo 15",
      "Dehiwala", "Godagama", "Hanwella", "Homagama", "Kaduwela",
      "Kesbewa", "Kohuwala", "Kolonnawa", "Kottawa", "Kotte",
      "Maharagama", "Malabe", "Meegoda", "Moratuwa", "Mount Lavinia",
      "Nawala", "Nugegoda", "Padukka", "Pannipitiya", "Piliyandala",
      "Rajagiriya", "Ratmalana", "Talawatugoda", "Wellampitiya"
    ],
    'Gampaha': [
      "Negombo", "Kadawatha", "Kiribathgoda", "Nittambuwa", "Ragama",
      "Wattala", "Ja-Ela", "Gampaha", "Mirigama", "Veyangoda",
      "Minuwangoda", "Divulapitiya", "Attanagalla", "Biyagama", "Katana"
    ],
    'Kalutara': [
      "Panadura", "Kalutara South", "Kalutara North", "Beruwala",
      "Wadduwa", "Horana", "Aluthgama", "Matugama", "Bandaragama",
      "Millaniya", "Agalawatta", "Bulathsinhala", "Dodangoda", "Palindanuwara"
    ],
    'Kandy': [
      "Peradeniya", "Katugastota", "Digana", "Gampola", "Nawalapitiya",
      "Pilimathalawa", "Kadugannawa", "Kundasale", "Akurana", "Galagedara",
      "Harispattuwa", "Pathadumbara", "Udunuwara", "Yatinuwara"
    ],
    'Matale': [
      "Dambulla", "Ukuwela", "Rattota", "Galewela", "Pallepola",
      "Sigiriya", "Yatawatta", "Matale", "Naula", "Palapathwela",
      "Raththota", "Wilgamuwa"
    ],
    'Nuwara_Eliya': [
      "Hatton", "Nanu Oya", "Talawakele", "Ragala", "Walapane",
      "Maskeliya", "Haputale", "Nuwara_Eliya", "Ambagamuwa", "Kotagala",
      "Lindula", "Agarapathana", "Dayagama", "Bogawantalawa"
    ],
    'Galle': [
      "Hikkaduwa", "Unawatuna", "Karapitiya", "Baddegama", "Ambalangoda",
      "Bentota", "Elpitiya", "Galle", "Ahangama", "Balapitiya",
      "Habaraduwa", "Imaduwa", "Nagoda", "Thalagaha"
    ],
    'Matara': [
      "Weligama", "Akurugoda", "Athuraliya", "Hakmana", "Devinuwara",
      "Kamburupitiya", "Dickwella", "Matara", "Akuressa", "Kottegoda",
      "Malimbada", "Pitabeddara", "Thihagoda", "Weligatta"
    ],
    'Hambantota': [
      "Tangalle", "Tissamaharama", "Ambalantota", "Weeraketiya",
      "Beliatta", "Walasmulla", "Sooriyawewa", "Hambantota", "Angunukolapelessa",
      "Katuwana", "Lunugamvehera", "Okewela", "Ranna", "Siththamparanthota"
    ],
    'Jaffna': [
      "Chavakachcheri", "Point Pedro", "Nallur", "Kopay", "Karainagar",
      "Velanai", "Kankesanthurai", "Jaffna", "Chankanai", "Delft",
      "Maruthnkerny", "Nelliady", "Sandilipay", "Tellippalai"
    ],
    'Kilinochchi': [
      "Poonaka-ri", "Karachchi", "Pallai", "Kandawalai", "Paranthan",
      "Murukandy", "Kilinochchi Town", "Kilinochchi", "Kandavalai",
      "Pachchilaipalli", "Poonakary", "Sinhapura", "Vannerikulam"
    ],
    'Mannar': [
      "Madhu", "Musali", "Nanattan", "Manthai West", "Manthai East",
      "Vavuniya South", "Adampan", "Mannar", "Nanaddan", "Tharapuram",
      "Thalvupadu", "Uyilankulam", "Vellankulam", "Vidataltivu"
    ],
    'Vavuniya': [
      "Nedunkerny", "Vavuniya South", "Vavuniya North", "Vengalacheddikulam",
      "Settikulam", "Omanthai", "Cheddikulam", "Vavuniya", "Poovarasankulam",
      "Pampaimadu", "Periyakulam", "Puliyankulam", "Sivapuram", "Thandikulam"
    ],
    'Mullaitivu': [
      "Puthukkudiyiruppu", "Thunukkai", "Oddusuddan", "Mallavi",
      "Mullaitivu Town", "Maritimepattu", "Manthai East", "Mullaitivu",
      "Alampil", "Kokkuthuduwai", "Kumulamunai", "Nayaru", "Puthukudiyiruppu",
      "Visvamadu"
    ],
    'Batticaloa': [
      "Kattankudy", "Eravur", "Valaichchenai", "Kaluwanchikudy",
      "Arayampathy", "Vavunathivu", "Oddamavadi", "Batticaloa", "Chenkalady",
      "Kiran", "Kurukkalmadam", "Mankerny", "Paddippalai", "Vakarai"
    ],
    'Trincomalee': [
      "Kinniya", "Muttur", "Kuchchaveli", "Kantalai", "Seruvila",
      "Pulmoddai", "Sampur", "Trincomalee", "Gomarankadawala", "Kinniya",
      "Kuchchaveli", "Morawewa", "Nilaveli", "Thambalagamuwa"
    ],
    'Ampara': [
      "Akkaraipattu", "Sammanthurai", "Kalmunai", "Uhana",
      "Dehiattakandiya", "Pottuvil", "Addalachchenai", "Ampara",
      "Damana", "Karaitivu", "Mahaoya", "Navithanveli", "Padiyatalawa",
      "Sainthamaruthu"
    ],
    'Badulla': [
      "Bandarawela", "Welimada", "Ella", "Hali-Ela", "Mahiyanganaya",
      "Passara", "Haputale", "Badulla", "Kandaketiya", "Lunugala",
      "Meegahakivula", "Rideemaliyadda", "Soranathota", "Uva Paranagama"
    ],
    'Monaragala': [
      "Wellawaya", "Bibile", "Medagama", "Madulla", "Siyambalanduwa",
      "Buttala", "Kataragama", "Monaragala", "Badalkumbura", "Koslanda",
      "Okkampitiya", "Sevanagala", "Thanamalvila", "Wedikumbura"
    ],
    'Anuradhapura': [
      "Kekirawa", "Eppawala", "Mihintale", "Medawachchiya",
      "Tambuttegama", "Thirappane", "Nochchiyagama", "Anuradhapura",
      "Galenbindunuwewa", "Horowpothana", "Ipalogama", "Kahatagasdigiliya",
      "Kebithigollewa", "Nachchadoowa"
    ],
    'Polonnaruwa': [
      "Medirigiriya", "Hingurakgoda", "Dimbulagala", "Elahera",
      "Welikanda", "Giritale", "Aralaganwila", "Polonnaruwa",
      "Lankapura", "Thamankaduwa", "Welikanda", "Dimbulagala",
      "Hingurakgoda", "Medirigiriya"
    ],
    'Puttalam': [
      "Chilaw", "Wennappuwa", "Anamaduwa", "Marawila",
      "Nattandiya", "Pallama", "Dankotuwa", "Puttalam",
      "Arachchikattuwa", "Kalpitiya", "Karuwalagaswewa",
      "Mundalama", "Nawagattegama", "Vanathavilluwa"
    ],
    'Kurunegala': [
      "Ibbagamuwa", "Mawathagama", "Kuliyapitiya", "Pannala",
      "Polgahawela", "Alawwa", "Narammala", "Kurunegala",
      "Bingiriya", "Galgamuwa", "Ganewatta", "Giribawa",
      "Mallawapitiya", "Nikaweratiya"
    ],
    'Ratnapura': [
      "Pelmadulla", "Kuruwita", "Balangoda", "Embilipitiya",
      "Godakawela", "Kalawana", "Eheliyagoda", "Ratnapura",
      "Ayagama", "Kiriella", "Nivithigala", "Opanayaka",
      "Rakwana", "Weligepola"
    ],
    'Kegalle': [
      "Mawanella", "Warakapola", "Rambukkana", "Deraniyagala",
      "Bulathkohupitiya", "Aranayaka", "Yatiyanthota", "Kegalle",
      "Dehiowita", "Galigamuwa", "Kitulgala", "Ruwanwella",
      "Thulhiriya", "Weligamuwa"
    ]
  };


  const handleLocationChange = (e: any) => {
    setLocation(e.target.value);
    setSubLocation(""); // Reset sub-location when city changes
  };

  const handleSubLocationChange = (e: any) => {
    setSubLocation(e.target.value);
  };

  return (
    <Stack
      spacing={5}
      sx={{
        p: 5,
        pt: 10,
        ...(plus && {
          borderLeft: (theme) => `dashed 1px ${theme.palette.divider}`,
          borderRight: (theme) => `dashed 1px ${theme.palette.divider}`,
          ...sx,
        }),
      }}
      {...other}
    >
      <Stack spacing={2}>
        <Typography variant="overline" component="div" sx={{ color: 'text.disabled' }}>
          Payment Plans
        </Typography>

        <Box sx={{ position: 'relative' }}>
          <Typography variant="h4">{license}</Typography>
          <Box
            sx={{
              left: 0,
              bottom: 4,
              width: 40,
              height: 8,
              opacity: 0.48,
              bgcolor: 'error.main',
              position: 'absolute',
              ...(standardLicense && { bgcolor: 'primary.main' }),
              ...(plus && { bgcolor: 'warning.main' }),
            }}
          />
        </Box>
      </Stack>

      {standardLicense ? (
        <Box component="img" alt={icons[1]} src={icons[1]} sx={{ width: 20, height: 20 }} />
      ) : (
        <Stack direction="row" spacing={2}>
          {icons.map((icon) => (
            <Box component="img" key={icon} alt={icon} src={icon} sx={{ width: 20, height: 20 }} />
          ))}
        </Stack>
      )}

      <Stack spacing={2.5}>
        {commons.map((option) => (
          <Stack key={option} spacing={1} direction="row" alignItems="center">
            <Iconify icon="eva:checkmark-fill" width={16} />
            <Typography variant="body2">{option}</Typography>
          </Stack>
        ))}

        <Divider sx={{ borderStyle: 'dashed' }} />

        {options.map((option, optionIndex) => {
          const disabled =
            (standardLicense && optionIndex === 1) ||
            (standardLicense && optionIndex === 2) ||
            (standardLicense && optionIndex === 3) ||
            (plus && optionIndex === 3);

          return (
            <Stack
              spacing={1}
              direction="row"
              alignItems="center"
              sx={{
                ...(disabled && { color: 'text.disabled' }),
              }}
              key={option}
            >
              <Iconify icon={disabled ? 'mingcute:close-line' : 'eva:checkmark-fill'} width={16} />
              <Typography variant="body2">{option}</Typography>
            </Stack>
          );
        })}
      </Stack>
      <Box sx={{ position: 'relative' }}>

  <Typography variant="h6" sx={{ color: 'text.secondary', mt: 0.5 }}>
  Today Free
  </Typography>
  <Box
    sx={{
      left: 0,
      bottom: 4,
      width: 40,
      height: 8,
      opacity: 0.48,
      bgcolor: 'error.main',
      position: 'absolute',
      ...(standardLicense && { bgcolor: 'primary.main' }),
      ...(plus && { bgcolor: 'warning.main' }),
    }}
  />
</Box>


      <Stack alignItems="flex-end">
        <Button
          onClick={handleOpen}
          color="inherit"
          size="small"

          endIcon={<Iconify icon="eva:arrow-ios-forward-fill" />}
        >
          Select
        </Button>
      </Stack>
      {/* Popup Modal */}
      <Modal open={open} onClose={handleClose}>
        <Box sx={modalStyle}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Select Details
          </Typography>

          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Select a Vehicle</InputLabel>
            <Select value={vehicle} onChange={(e) => setVehicle(e.target.value)}>
              {vehicleTypes.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Select a Location</InputLabel>
            <Select value={location} onChange={handleLocationChange}>
              {Object.keys(subLocations).map((city) => (
                <MenuItem key={city} value={city}>
                  {city}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Select a Sub-Location</InputLabel>
            <Select
              value={subLocation}
              onChange={handleSubLocationChange}
              disabled={!location} // Disable if no city is selected
            >
            {subLocations[location as keyof typeof subLocations]?.map((subLoc) => (
  <MenuItem key={subLoc} value={subLoc}>
    {subLoc}
  </MenuItem>
))}

            </Select>
          </FormControl>

          <Button variant="contained" onClick={handleCreatePost}>
            Next
          </Button>
        </Box>
      </Modal>
    </Stack>
  );
}
