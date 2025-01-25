import { useCallback, useState } from 'react';
import Box from '@mui/material/Box';
import Pagination, { paginationClasses } from '@mui/material/Pagination';
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { AdPost } from 'src/types/tour';
import TourItem from './tour-item';

type Props = {
  tours: AdPost[];
};

export default function TourList({ tours }: Props) {
  console.log(tours, '000000000000000000000');

  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const paginatedTours = tours.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
  };

  const handleView = useCallback(
    (id: string) => {
      router.push(paths.dashboard.tour.details(id));
    },
    [router]
  );

  const handleEdit = useCallback(
    (id: string) => {
      router.push(paths.dashboard.tour.edit(id));
    },
    [router]
  );

  const handleDelete = useCallback((id: string) => {
    console.info('DELETE', id);
 
  }, []);

  if (tours.length === 0) {
    return <Box textAlign="center">No tours available</Box>;
  }

  return (
    <>
      <Box
        gap={3}
        display="grid"
        gridTemplateColumns={{
          xs: 'repeat(1, 1fr)',
          sm: 'repeat(2, 1fr)',
          md: 'repeat(3, 1fr)',
        }}
      >
        {paginatedTours.map((tour, index) => (
          <TourItem
            key={tour._id || tour.id || index}
            tour={tour}
            onView={() => handleView(tour._id || tour.id)}
            onEdit={() => handleEdit(tour._id || tour.id)}
            onDelete={() => handleDelete(tour._id || tour.id)}
          />
        ))}
      </Box>

      {tours.length > itemsPerPage && (
        <Pagination
          count={Math.ceil(tours.length / itemsPerPage)}
          page={currentPage}
          onChange={handlePageChange}
          sx={{
            mt: 8,
            [`& .${paginationClasses.ul}`]: {
              justifyContent: 'center',
            },
          }}
        />
      )}
    </>
  );
}
