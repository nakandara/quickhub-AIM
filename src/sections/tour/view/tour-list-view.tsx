import orderBy from 'lodash/orderBy';
import { useState, useCallback, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { useBoolean } from 'src/hooks/use-boolean';

import { isAfter, isBetween } from 'src/utils/format-time';
import { useGetUserPosts, useGetVerifiedPosts } from 'src/api/post';
import { countries } from 'src/assets/data';
import { _tourGuides, TOUR_SORT_OPTIONS, TOUR_SERVICE_OPTIONS } from 'src/_mock';

import Iconify from 'src/components/iconify';
import EmptyContent from 'src/components/empty-content';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { useGetOtp } from 'src/api/otp';

import { useMockedUser } from 'src/hooks/use-mocked-user';

import { AdPost, ITourFilters } from 'src/types/tour';

import TourList from '../tour-list';
import TourSort from '../tour-sort';
import TourSearch from '../tour-search';
import TourFilters from '../tour-filters';
import TourFiltersResult from '../tour-filters-result';

// ----------------------------------------------------------------------

const defaultFilters: ITourFilters = {
  destination: [],
  tourGuides: [],
  services: [],
  startDate: null,
  endDate: null,
};

// ----------------------------------------------------------------------

export default function TourListView() {
  const settings = useSettingsContext();
  const { verifiedPosts } = useGetVerifiedPosts();
  const { user } = useMockedUser();
  const openFilters = useBoolean();
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname.split('/').pop();

  const [sortBy, setSortBy] = useState('latest');

  const { userPosts } = useGetUserPosts(user?.userId);
  const { otpData, otpDataLoading } = useGetOtp(user?.userId);
  const isVerified = otpData?.some((otp: { veryOTP: any }) => otp.veryOTP);

  const [search, setSearch] = useState<{ query: string; results: any[] }>({
    query: '',
    results: [],
  });

  const [filters, setFilters] = useState(defaultFilters);

  const dateError = isAfter(filters.startDate, filters.endDate);

  // Properly extract data array from API responses
  const verifiedPostsData = verifiedPosts?.data || [];

  
  console.log(userPosts, 'User posts in component');

  // Directly use userPosts instead of userPostsData
  const dataSource = currentPath === 'yourAdvertisement' ? userPosts : verifiedPosts;

  const handleSearch = useCallback(
    (inputValue: string) => {
      setSearch((prevState) => ({
        ...prevState,
        query: inputValue,
      }));
    },
    []
  );

  const dataFiltered = applyFilter({
    inputData: dataSource,
    filters,
    sortBy,
    dateError,
    searchQuery: search.query,
  });

  const canReset =
    !!filters.destination.length ||
    !!filters.tourGuides.length ||
    !!filters.services.length ||
    (!!filters.startDate && !!filters.endDate);

  const notFound = !dataFiltered.length && (canReset || !!search.query);

  const handleFilters = useCallback((name: string, value: any) => {
    setFilters((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }, []);

  const handleResetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  const handleSortBy = useCallback((newValue: string) => {
    setSortBy(newValue);
  }, []);

  useEffect(() => {
    const isOtpPage = location.pathname.includes('otp');
    const shouldRedirect =
      !otpDataLoading &&
      currentPath === 'yourAdvertisement' &&
      !isVerified &&
      !isOtpPage;

    if (shouldRedirect) {
      navigate(paths.authDemo.modern.otp);
    }
  }, [isVerified, otpDataLoading, currentPath, navigate, location.pathname]);

  if (otpDataLoading || (currentPath === 'yourAdvertisement' && !isVerified)) {
    return null;
  }

  const renderFilters = (
    <Stack
      spacing={3}
      justifyContent="space-between"
      alignItems={{ xs: 'flex-end', sm: 'center' }}
      direction={{ xs: 'column', sm: 'row' }}
    >
      <TourSearch
        query={search.query}
        results={search.results}
        onSearch={handleSearch}
        hrefItem={(id: string) => paths.dashboard.tour.details(id)}
      />

      <Stack direction="row" spacing={1} flexShrink={0}>
        <TourFilters
          open={openFilters.value}
          onOpen={openFilters.onTrue}
          onClose={openFilters.onFalse}
          filters={filters}
          onFilters={handleFilters}
          canReset={canReset}
          onResetFilters={handleResetFilters}
          serviceOptions={TOUR_SERVICE_OPTIONS.map((option) => option.label)}
          tourGuideOptions={_tourGuides}
          destinationOptions={countries.map((option) => option.label)}
          dateError={dateError}
        />

        <TourSort sort={sortBy} onSort={handleSortBy} sortOptions={TOUR_SORT_OPTIONS} />
      </Stack>
    </Stack>
  );

  const renderResults = (
    <TourFiltersResult
      filters={filters}
      onResetFilters={handleResetFilters}
      canReset={canReset}
      onFilters={handleFilters}
      results={dataFiltered.length}
    />
  );

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="List"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          {
            name: 'Tour',
            href: paths.dashboard.tour.root,
          },
          { name: 'List' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <Stack
        spacing={2.5}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      >
        {renderFilters}
        {canReset && renderResults}
      </Stack>

      {notFound ? (
        <EmptyContent title="No Data" filled sx={{ py: 10 }} />
      ) : (
        <TourList tours={dataFiltered} />
      )}
    </Container>
  );
}

// ----------------------------------------------------------------------

const applyFilter = ({
  inputData,
  filters,
  sortBy,
  dateError,
  searchQuery,
}: {
  inputData: any[];
  filters: ITourFilters;
  sortBy: string;
  dateError: boolean;
  searchQuery: string;
}) => {
  // Return empty array if no input data
  if (!inputData || inputData.length === 0) return [];

  const { services, destination, startDate, endDate, tourGuides } = filters;
  const tourGuideIds = tourGuides.map((tourGuide) => tourGuide.id);

  let filteredData = [...inputData];

  // Apply search filter
  if (searchQuery) {
    filteredData = filteredData.filter((item) => {
      const searchFields = [
        item.model,
        item.brand,
        item.description,
        item.location,
        item.price?.toString(),
      ].filter(Boolean);

      return searchFields.some(
        (field) => field.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
  }

  // SORT BY
  if (sortBy === 'latest') {
    filteredData = orderBy(filteredData, ['createdAt'], ['desc']);
  }

  if (sortBy === 'oldest') {
    filteredData = orderBy(filteredData, ['createdAt'], ['asc']);
  }

  if (sortBy === 'popular') {
    filteredData = orderBy(filteredData, ['totalViews'], ['desc']);
  }

  // FILTERS
  if (destination.length) {
    filteredData = filteredData.filter((tour) => 
      tour.destination && destination.includes(tour.destination)
    );
  }

  if (tourGuideIds.length) {
    filteredData = filteredData.filter((tour) =>
      tour.tourGuides?.some((filterItem: { id: string }) => 
        tourGuideIds.includes(filterItem.id)
      )
    );
  }

  if (services.length) {
    filteredData = filteredData.filter((tour) =>
      tour.services?.some((item: string) => services.includes(item))
    );
  }

  if (!dateError && startDate && endDate) {
    filteredData = filteredData.filter((tour) =>
      tour.available && isBetween(startDate, tour.available.startDate, tour.available.endDate)
    );
  }

  return filteredData;
};