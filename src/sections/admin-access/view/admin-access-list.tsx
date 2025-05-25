import { useState, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import LinearProgress from '@mui/material/LinearProgress';
import { Chip, IconButton, Tooltip } from '@mui/material';

import { fDateTime } from 'src/utils/format-time';
import { fCurrency } from 'src/utils/format-number';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { TableHeadCustom } from 'src/components/table';

import { getAllPosts, Post } from 'src/api/post';
import PostDetailsDialog from '../post-details-dialog';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'title', label: 'Title' },
  { id: 'brand', label: 'Brand' },
  { id: 'price', label: 'Price', align: 'right' },
  { id: 'condition', label: 'Condition' },
  { id: 'verify', label: 'Status' },
  { id: 'createdAt', label: 'Posted Date' },
  { id: 'actions', label: 'Actions', align: 'right' },
];

// ----------------------------------------------------------------------

export default function AdminAccessList() {
  const theme = useTheme();

  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [openDialog, setOpenDialog] = useState(false);

  const fetchPosts = async () => {
    try {
      const response = await getAllPosts();
      if (response.success) {
        setPosts(response.data);
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError('Failed to fetch posts');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleViewPost = (post: Post) => {
    setSelectedPost(post);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedPost(null);
  };

  const handleVerificationSuccess = () => {
    // Refresh the posts list after successful verification
    fetchPosts();
  };

  if (loading) {
    return (
      <Box sx={{ width: '100%', mt: 3 }}>
        <LinearProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <>
      <Card>
        <CardHeader
          title="All Posts"
          sx={{
            mb: 3,
            '& .MuiCardHeader-action': { m: 0 },
          }}
        />

        <TableContainer sx={{ overflow: 'unset' }}>
          <Scrollbar>
            <Table sx={{ minWidth: 960 }}>
              <TableHeadCustom headLabel={TABLE_HEAD} />

              <TableBody>
                {posts.map((post) => (
                  <TableRow key={post._id}>
                    <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar
                        alt={post.title}
                        src={post.images[0]?.imageUrl}
                        variant="rounded"
                        sx={{ width: 48, height: 48, mr: 2 }}
                      />
                      <Typography variant="subtitle2" noWrap>
                        {post.title}
                      </Typography>
                    </TableCell>

                    <TableCell>{post.brand}</TableCell>

                    <TableCell align="right">{post.price}</TableCell>

                    <TableCell>
                      <Label
                        variant={theme.palette.mode === 'light' ? 'soft' : 'filled'}
                        color={post.condition === 'New' ? 'success' : 'warning'}
                      >
                        {post.condition}
                      </Label>
                    </TableCell>

                    <TableCell>
                      <Label
                        variant={theme.palette.mode === 'light' ? 'soft' : 'filled'}
                        color={post.verify ? 'success' : 'error'}
                      >
                        {post.verify ? 'Verified' : 'Pending'}
                      </Label>
                    </TableCell>

                    <TableCell>{fDateTime(post.createdAt)}</TableCell>

                    <TableCell align="right">
                      <Stack direction="row" spacing={1} justifyContent="flex-end">
                        {post.tags.map((tag) => (
                          <Chip key={tag} label={tag} size="small" />
                        ))}
                        <Tooltip title="View Details">
                          <IconButton onClick={() => handleViewPost(post)}>
                            <Iconify icon="solar:eye-bold" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Edit">
                          <IconButton>
                            <Iconify icon="solar:pen-bold" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton color="error">
                            <Iconify icon="solar:trash-bin-trash-bold" />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Scrollbar>
        </TableContainer>
      </Card>

      <PostDetailsDialog
        post={selectedPost}
        open={openDialog}
        onClose={handleCloseDialog}
        onVerificationSuccess={handleVerificationSuccess}
      />
    </>
  );
}