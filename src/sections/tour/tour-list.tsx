import { useCallback, useState, useEffect } from 'react'; // Add useEffect
import Box from '@mui/material/Box';
import Pagination, { paginationClasses } from '@mui/material/Pagination';
import { paths } from 'src/routes/paths';
import { useLocation } from 'react-router';
import { useRouter } from 'src/routes/hooks';
import { AdPost } from 'src/types/tour';
import TourItem from './tour-item';

type Props = {
  tours: AdPost[];
};

export default function TourList({ tours }: Props) {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
    const location = useLocation();
  const [posts, setPosts] = useState<AdPost[]>(tours); // Initialize state with tours
  const itemsPerPage = 8;

  // Sync posts state with tours prop
  useEffect(() => {
    setPosts(tours); // Update posts state whenever tours prop changes
  }, [tours]);

  const paginatedTours = posts.slice(
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

  // Callback function to handle post deletion
  const handleDelete = useCallback((postId: string) => {
    setPosts((prevTours) => prevTours.filter((tour) => tour._id !== postId));
  }, []);

  if (posts.length === 0) {
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
            onDelete={() => handleDelete(tour._id)} // Pass the handleDelete callback
          />
        ))}
      </Box>

      {posts.length > itemsPerPage && (
        <Pagination
          count={Math.ceil(posts.length / itemsPerPage)}
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