import React, { useEffect, useState } from 'react';
import BoardsService from '../../services/trello/BoardsService';
import Stack from '@mui/material/Stack';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import LoadingButton from '@mui/lab/LoadingButton';
import Divider from '@mui/material/Divider';
import { TrelloBoard } from '../../interfaces';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { useNavigate } from 'react-router-dom';
import { RoutesPath } from '../../constants/route-paths';
import usePromptModal from '../../helpers/hooks/usePromptModal';
import Skeleton from '@mui/material/Skeleton';
import { array3 } from '../../constants/skeletons';
import { ReactComponent as Logo } from '../../assets/images/vectors/create-trello-board.svg';
import { useTheme } from '@mui/material';

const Boards = () => {
  const [boards, setBoards] = useState<TrelloBoard[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [loadingCreate, setLoadingCreate] = useState(false);

  const navigate = useNavigate();
  const { handlePrompt } = usePromptModal();

  const theme = useTheme();

  const handleCreate = async () => {
    setLoadingCreate(true);
    const result = await handlePrompt(
      'Enter board name',
      'test board',
      'Create'
    );
    if (!result.success) {
      return setLoadingCreate(false);
    }
    await BoardsService.create({ title: result.value });
    BoardsService.getList<TrelloBoard[]>()
      .then((data) => setBoards(data))
      .finally(() => setLoadingCreate(false));
  };

  const handleRemove = async (id: string) => {
    setLoadingDelete(true);
    await BoardsService.remove(id);

    BoardsService.getList<TrelloBoard[]>().then((data) => {
      setBoards(data);
      setLoadingDelete(false);
    });
  };

  useEffect(() => {
    setLoading(true);
    BoardsService.getList<TrelloBoard[]>()
      .then((data) => setBoards(data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Container>
      {!!boards.length && (
        <LoadingButton
          loading={loadingCreate}
          variant="contained"
          onClick={handleCreate}
          sx={{ my: 2 }}
        >
          Create new board
        </LoadingButton>
      )}
      {!!boards.length && (
        <Typography component="h1" variant="h5">
          Your boards
        </Typography>
      )}
      {loading && (
        <Stack spacing={2}>
          {array3.map((_, i) => (
            <Skeleton key={i} variant="rounded" height={70} width="100%" />
          ))}
        </Stack>
      )}

      {!boards.length && !loading && (
        <Stack alignSelf="center" alignItems="center" spacing={3}>
          <Logo width="40vw" style={{ minWidth: '350px', maxWidth: '600px' }} />
          <Typography fontWeight="bold" variant="h5" textAlign="center">
            You don't have any boards yet. Create a new one
          </Typography>
          <LoadingButton
            loading={loadingCreate}
            variant="contained"
            onClick={handleCreate}
            sx={{ my: 2 }}
          >
            Create
          </LoadingButton>
        </Stack>
      )}
      <Stack spacing={2}>
        {boards.map((board, index) => (
          <Card
            sx={{ backgroundColor: theme.palette.secondary.main }}
            key={board._id}
          >
            <CardContent>
              <Stack spacing={1}>
                <Stack
                  justifyContent="space-between"
                  direction="row"
                  spacing={2}
                  alignItems="center"
                >
                  <Typography>{board.title}</Typography>

                  <Stack direction="row" spacing={2} alignItems="center">
                    <LoadingButton
                      variant="contained"
                      loading={loadingDelete}
                      onClick={() =>
                        navigate(
                          RoutesPath.BOARD_BY_ID.replace(':id', board._id)
                        )
                      }
                    >
                      Open
                    </LoadingButton>
                    <LoadingButton
                      loading={loadingDelete}
                      variant="contained"
                      color="error"
                      onClick={() => handleRemove(board._id)}
                    >
                      Delete
                    </LoadingButton>
                  </Stack>
                </Stack>
              </Stack>
            </CardContent>
            {index !== boards.length - 1 && <Divider />}
          </Card>
        ))}
      </Stack>
    </Container>
  );
};

export default Boards;
