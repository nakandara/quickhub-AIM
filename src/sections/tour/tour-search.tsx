import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import ClickAwayListener from '@mui/material/ClickAwayListener';

import { useBoolean } from 'src/hooks/use-boolean';
import Iconify from 'src/components/iconify';
import SearchNotFound from 'src/components/search-not-found';
import { ITourItem } from 'src/types/tour';

// ----------------------------------------------------------------------

type Props = {
  query: string;
  results: ITourItem[];
  onSearch: (inputValue: string) => void;
  hrefItem: (id: string) => string;
};

export default function TourSearch({ query, results, onSearch, hrefItem }: Props) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState(query);
  const open = useBoolean();

  const handleSearch = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const newQuery = event.target.value;
      setSearchQuery(newQuery);
      onSearch(newQuery);
    },
    [onSearch]
  );

  const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      onSearch(searchQuery);
    }
  };

  const handleClick = useCallback(
    (href: string) => {
      navigate(href);
      open.onFalse();
    },
    [navigate, open]
  );

  return (
    <ClickAwayListener onClickAway={open.onFalse}>
      <Box sx={{ width: 1, position: 'relative' }}>
        <TextField
          fullWidth
          value={searchQuery}
          onChange={handleSearch}
          onKeyUp={handleKeyUp}
          placeholder="Search..."
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
              </InputAdornment>
            ),
            endAdornment: searchQuery && (
              <InputAdornment position="end">
                <IconButton onClick={() => {
                  setSearchQuery('');
                  onSearch('');
                }}>
                  <Iconify icon="eva:close-fill" />
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              bgcolor: 'background.paper',
            },
          }}
        />
      </Box>
    </ClickAwayListener>
  );
}
