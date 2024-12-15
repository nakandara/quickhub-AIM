import Box from '@mui/material/Box';
import { IUserCard } from 'src/types/user';
import { useNavigate } from 'react-router-dom';
import CategoryCard from './category-card';


type Props = {
  users: IUserCard[];
};

export default function CategoryCardList({ users }: Props) {
  const navigate = useNavigate();

  const handleCardClick = (name: string) => {
    navigate(`/dashboard/posts/package/${name}`);
  };

  return (
    <Box
      gap={3}
      display="grid"
      gridTemplateColumns={{
        xs: 'repeat(1, 1fr)',
        sm: 'repeat(2, 1fr)',
        md: 'repeat(3, 1fr)',
      }}
    >
      {users.map((user) => (
        <CategoryCard
          key={user.id}
          user={user}
          onClick={() => handleCardClick(user.name)}
        />
      ))}
    </Box>
  );
}
