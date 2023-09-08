import React, { useEffect, useRef, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import { useSnackbar } from 'notistack';
import { cellMap } from '../../game-rules/chess';
import { Board } from '../../game-rules/chess/classes/Board';
import { useSocket } from '../../context/socket.context';
import { useForceUpdate } from '../../helpers/hooks/useForceUpdate';
import {
  ChessGame,
  FIGURE_COLOR,
  GAME_STATUS,
} from '../../interfaces/games/chess';
import { isMobile } from '../../helpers/isMobile';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import Button from '@mui/material/Button';
import ChessGamesService from '../../services/ChessGamesService';
import chessGamesService from '../../services/ChessGamesService';
import LoadingButton from '@mui/lab/LoadingButton';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import Card from '@mui/material/Card';
import MiniChessBoard from '../../components/MiniChessBoard';
import Container from '@mui/material/Container';
import Skeleton from '@mui/material/Skeleton';
import { array2 } from '../../constants/skeletons';
import { useNavigate, useParams } from 'react-router-dom';
import { RoutesPath } from '../../constants/route-paths';
import Loader from '../../components/Loader';
import ChessConfigsService from '../../services/ChessConfigsService';
import { ChessConfig } from '../../interfaces';
import { useTheme } from '@mui/material';

export const CELL_SIZE = isMobile() ? 45 : 80;

export const buildBoard = () => {
  return Array.from({ length: 8 })
    .fill(0)
    .map((_, i) => {
      return (
        <Stack direction="row" key={`row-${i}`} className="row">
          {Array.from({ length: 8 })
            .fill(0)
            .map((_, j) => {
              return <Box className="cell" key={`cell-${i}-${j}`} />;
            })}
        </Stack>
      );
    });
};

enum PLAY_WITH {
  'AI' = 'AI',
  'USER' = 'USER',
}

const Chess = () => {
  const { gameId } = useParams<{ gameId: string }>();
  const boardRef = useRef<Board>(new Board());
  const [games, setGames] = useState<ChessGame[]>([]);
  const [gamesLoading, setGamesLoading] = useState(true);
  const [board, setBoard] = useState<Board>(boardRef.current);
  const [selected, setSelected] = useState<{ i: number; j: number } | null>(
    null
  );
  const [yourColor, setColor] = useState<FIGURE_COLOR>();
  const [history, setHistory] = useState<any[]>([]);
  const [deep, setDeep] = useState(0);
  const [playWith, setPlayWith] = useState<PLAY_WITH>(PLAY_WITH.AI);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);

  const forceUpdate = useForceUpdate();
  const { enqueueSnackbar } = useSnackbar();
  const socket = useSocket();
  const theme = useTheme();
  const navigate = useNavigate();

  const rotateBoard = yourColor === FIGURE_COLOR.BLACK;

  const buildFigures = () => {
    const handleClick = (i: number, j: number) => {
      const emit = () => {
        if (boardRef.current.status === GAME_STATUS.GAME_DONE) {
          return;
        }
        socket.emit('chess-move', {
          from: {
            ...selected,
          },
          to: {
            i,
            j,
          },
          deep,
        });
      };

      if (board.getFigure(i, j)) {
        if (!selected && board.getFigureColor(i, j) !== yourColor) {
          return;
        }
        if (!selected) {
          setSelected({ i, j });
        } else if (selected.i === i && selected.j === j) {
          setSelected(null);
        } else {
          emit();
        }
      } else {
        if (selected) {
          emit();
        }
      }
    };

    return Array.from({ length: 8 })
      .fill(0)
      .map((_, i) => {
        return Array.from({ length: 8 })
          .fill(0)
          .map((_, j) => {
            const newI = rotateBoard ? 8 - i - 1 : i;
            const newJ = rotateBoard ? 8 - j - 1 : j;

            return (
              <Box
                onClick={() => handleClick(i, j)}
                sx={{
                  position: 'absolute',
                  top: newI * CELL_SIZE,
                  left: newJ * CELL_SIZE,
                  backgroundSize: 'cover',
                  border:
                    selected && selected.i === i && selected.j === j
                      ? '4px solid black'
                      : 'none',
                  backgroundImage: board.getFigure(i, j)?.img
                    ? `url(${board.getFigureImg(i, j)})`
                    : 'unset',
                }}
                className="figure"
                key={`cell-${newI}-${newJ}`}
              />
            );
          });
      });
  };

  const handlePlay = () => {
    if (playWith === PLAY_WITH.AI) {
      socket.emit('init-chess-ai', { initNewGame: true });
    } else {
      socket.emit('init-chess', { initNewGame: true });
    }
    setIsPlaying(true);
  };

  const handleRemove = async (id: string) => {
    setLoadingDelete(true);
    await chessGamesService.remove(id);
    ChessGamesService.getList<ChessGame[]>()
      .then((data) => setGames(data))
      .finally(() => setLoadingDelete(false));
  };

  const handleOpen = (id: string) => {
    navigate(RoutesPath.GAMES_CHESS_BY_ID.replace(':gameId', id));
  };

  useEffect(() => {
    boardRef.current.onUpdate((newBoard) => {
      setBoard(newBoard);
      forceUpdate();
    });
    boardRef.current.onMessage((message) => {
      enqueueSnackbar(message, { variant: 'warning' });
    });
  }, []);

  useEffect(() => {
    const addListeners = () => {
      socket.on(
        'chess-connect',
        ({ color, pieces, checkMate, gameId: newGameId }) => {
          if (newGameId !== gameId) {
            setGames([]);
            setGamesLoading(true);
            ChessGamesService.getList<ChessGame[]>()
              .then((data) => setGames(data))
              .finally(() => setGamesLoading(false));
            return navigate(
              RoutesPath.GAMES_CHESS_BY_ID.replace(':gameId', newGameId)
            );
          }
          setColor(color);
          boardRef.current.updatePieces(pieces);
          ChessConfigsService.get<ChessConfig>().then((data) => {
            if (!data.config) {
              return;
            }
            boardRef.current.updateConfig(JSON.parse(data.config));
          });
          if (checkMate) {
            boardRef.current.updateStatus(GAME_STATUS.GAME_DONE);
          }
        }
      );
      socket.on('chess-move', (data) => {
        if (
          board
            .getFigure(data.from.i, data.from.j)
            ?.isLegalMove(board.getCell(data.to.i, data.to.j), false)
        ) {
          const from = cellMap(data.from.i, data.from.j);
          const to = cellMap(data.to.i, data.to.j);
          setHistory((prev) => [
            {
              from,
              to,
            },
            ...prev,
          ]);
        }

        board
          .getFigure(data.from.i, data.from.j)
          ?.moveTo(board.getCell(data.to.i, data.to.j));
        setSelected(null);
      });

      socket.on('checkmate', ({ winner }) => {
        boardRef.current.updateStatus(GAME_STATUS.GAME_DONE);
        if (winner === FIGURE_COLOR.WHITE) {
          alert('White win');
        } else {
          alert('Black win');
        }
      });

      socket.on('disconnect', () => {
        enqueueSnackbar('User has left the room', { variant: 'error' });
      });
    };
    if (socket.connected) {
      addListeners();
    }
    socket.on('connect', addListeners);

    return () => {
      socket.removeAllListeners();
    };
  }, [socket, gameId]);

  useEffect(() => {
    setGamesLoading(true);
    ChessGamesService.getList<ChessGame[]>()
      .then((data) => setGames(data))
      .finally(() => setGamesLoading(false));
  }, []);

  useEffect(() => {
    if (!games.length) {
      return;
    }
    const game = games.find((g) => g._id === gameId);
    if (!game) {
      setIsPlaying(false);
      return navigate(RoutesPath.GAMES_CHESS);
    }
    socket.emit(game.isAI ? 'init-chess-ai' : 'init-chess', { gameId });
    setIsPlaying(true);
  }, [gameId, games]);

  const beatenOpponent = board.beatenFigures.filter(
    (f) => f.color !== yourColor
  );
  const beatenYour = board.beatenFigures.filter((f) => f.color === yourColor);
  const game = games.find((g) => g._id === gameId);

  if (gamesLoading && gameId) {
    return null;
    // return (
    //   <Stack
    //     sx={{ height: 'calc(100vh - 200px)' }}
    //     alignItems="center"
    //     justifyContent="center"
    //   >
    //     <Loader />
    //   </Stack>
    // );
  }

  if (!isPlaying) {
    return (
      <Container>
        <Stack
          direction="row"
          flexWrap="wrap"
          useFlexGap
          spacing={3}
          justifyContent={isMobile() ? 'center' : 'initial'}
        >
          <Stack
            spacing={3}
            sx={{
              maxWidth: '400px',
              minWidth: '300px',
            }}
          >
            <InputLabel>Play with</InputLabel>
            <Select
              value={playWith}
              onChange={(e) => setPlayWith(e.target.value as PLAY_WITH)}
            >
              <MenuItem value={PLAY_WITH.AI}>AI</MenuItem>
              <MenuItem value={PLAY_WITH.USER}>Real user</MenuItem>
            </Select>
            {playWith === PLAY_WITH.AI && (
              <>
                <InputLabel>AI Deep</InputLabel>
                <Select value={deep} onChange={(e) => setDeep(+e.target.value)}>
                  {deeps.map((_, i) => (
                    <MenuItem key={i} value={i}>
                      {i}
                    </MenuItem>
                  ))}
                </Select>
              </>
            )}
            <Button variant="contained" onClick={handlePlay}>
              Play
            </Button>
          </Stack>
          {gamesLoading && (
            <Stack alignItems="center">
              <Typography variant="h6" sx={{ mb: '13px' }}>
                Previous games
              </Typography>
              {array2.map((_, i) => (
                <Card key={i} sx={{ backgroundColor: '#1e1e1e' }}>
                  <CardContent>
                    <Stack spacing={1}>
                      <Stack direction="row" spacing={2}>
                        <Skeleton
                          width={CELL_SIZE * 8 * (isMobile() ? 0.3 : 0.4)}
                          height={CELL_SIZE * 8 * (isMobile() ? 0.3 : 0.4)}
                          variant="rounded"
                        />

                        <Stack spacing={1} alignItems="start">
                          <Stack
                            direction="row"
                            spacing={1}
                            flexWrap="wrap"
                            useFlexGap
                          >
                            <Skeleton
                              width={102}
                              height={38}
                              variant="rounded"
                            />
                            <Skeleton
                              width={85}
                              height={38}
                              variant="rounded"
                            />
                          </Stack>
                          <Skeleton width="50%" height={20} variant="rounded" />
                          <Skeleton width="75%" height={20} variant="rounded" />
                        </Stack>
                      </Stack>
                    </Stack>
                  </CardContent>
                  {i !== array2.length - 1 && <Divider />}
                </Card>
              ))}
            </Stack>
          )}
          {!!games.length && (
            <Stack alignItems="center">
              <Typography variant="h6" sx={{ mb: '13px' }}>
                Previous games
              </Typography>
              {games.map((game, index) => (
                <Card
                  sx={{
                    backgroundColor: theme.palette.secondary.main,
                    width: '100%',
                  }}
                  key={game._id}
                >
                  <CardContent>
                    <Stack spacing={1}>
                      <Stack direction="row" spacing={2}>
                        <MiniChessBoard
                          scale={isMobile() ? 0.3 : 0.4}
                          pieces={
                            game.state ? JSON.parse(game.state).pieces : null
                          }
                        />

                        <Stack spacing={1} alignItems="start">
                          <Stack
                            direction="row"
                            spacing={1}
                            flexWrap="wrap"
                            useFlexGap
                          >
                            <LoadingButton
                              loading={loadingDelete}
                              onClick={() => handleOpen(game._id)}
                              variant="contained"
                            >
                              {game.winner ? 'Show' : 'Continue'}
                            </LoadingButton>
                            <LoadingButton
                              variant="contained"
                              loading={loadingDelete}
                              color="error"
                              onClick={() => handleRemove(game._id)}
                            >
                              Delete
                            </LoadingButton>
                          </Stack>
                          <Typography>
                            {game.isAI
                              ? 'Played with AI'
                              : 'Played with real user'}
                          </Typography>
                          <Typography>
                            {game.winner
                              ? `Winner is ${game.winner}`
                              : 'Game in progress'}
                          </Typography>
                        </Stack>
                      </Stack>
                    </Stack>
                  </CardContent>
                  {index !== games.length - 1 && <Divider />}
                </Card>
              ))}
            </Stack>
          )}
        </Stack>
      </Container>
    );
  }

  return (
    <Box sx={{ mx: isMobile() ? 0 : 5, maxWidth: '1200px' }}>
      <Typography sx={{ mb: 1 }} variant="h5">
        Your color: {yourColor}
      </Typography>
      <Stack sx={{ mb: 1 }} direction="row" spacing={1} alignItems="center">
        {board.status !== GAME_STATUS.GAME_DONE && (
          <>
            <Typography variant="h5">Turn:</Typography>
            <Typography
              sx={{
                px: '5px',
                background: board.currentColor === yourColor ? 'green' : 'grey',
              }}
              variant="h5"
            >
              {board.currentColor}
            </Typography>
          </>
        )}
        {board.checkMate && board.status !== GAME_STATUS.GAME_DONE && (
          <Typography
            sx={{
              px: '5px',
              background: board.checkMate === yourColor ? 'red' : 'green',
            }}
            variant="h5"
          >
            {board.checkMate === yourColor
              ? 'You have a check!'
              : 'Your opponent has a check'}
          </Typography>
        )}
        {board.status === GAME_STATUS.GAME_DONE && game && (
          <Typography
            sx={{
              px: '5px',
              background: game.winner === yourColor ? 'green' : 'red',
            }}
            variant="h5"
          >
            {game.winner === yourColor
              ? 'You win this game!'
              : 'You lose this game'}
          </Typography>
        )}
      </Stack>
      <Box sx={{ minHeight: '23px' }}>
        {!!beatenYour.length && (
          <Stack
            direction="row"
            flexWrap="wrap"
            useFlexGap
            sx={{
              width: 'fit-content',
              mb: 2,
              ml: 3,
            }}
          >
            {beatenYour.map((f, i) => (
              <Box
                sx={{
                  backgroundSize: 'cover',
                  backgroundImage: f.img ? `url(${f.img})` : 'unset',
                  width: CELL_SIZE / 2,
                  height: CELL_SIZE / 2,
                }}
                key={i}
              />
            ))}
          </Stack>
        )}
      </Box>
      <Stack
        direction="row"
        spacing={3}
        useFlexGap
        justifyContent="space-between"
        flexWrap="wrap"
      >
        <Stack sx={{ ml: isMobile() ? 2 : 3 }}>
          {buildBoard()}
          <Box style={{ position: 'absolute' }}>
            {nums.map((_, index) => (
              <Typography
                sx={{
                  position: 'absolute',
                  top: index * CELL_SIZE,
                  left: -CELL_SIZE / 4,
                  display: 'flex',
                  alignItems: 'center',
                  fontWeight: 'bold',
                }}
                className="figure"
                key={index}
              >
                {rotateBoard ? index + 1 : 8 - index}
              </Typography>
            ))}
            {buildFigures()}
            {letters.map((l, index) => (
              <Typography
                sx={{
                  position: 'absolute',
                  top: 8 * CELL_SIZE,
                  left: index * CELL_SIZE,
                  textAlign: 'center',
                  fontWeight: 'bold',
                }}
                className="figure"
                key={l}
              >
                {rotateBoard
                  ? letters[letters.length - index - 1].toUpperCase()
                  : l.toUpperCase()}
              </Typography>
            ))}
          </Box>
          <Box sx={{ mt: 3 }}>
            {!!beatenOpponent.length && (
              <Stack
                direction="row"
                flexWrap="wrap"
                useFlexGap
                sx={{
                  width: 'fit-content',
                  mb: 2,
                }}
              >
                {beatenOpponent.map((f, i) => (
                  <Box
                    sx={{
                      backgroundSize: 'cover',
                      backgroundImage: f.img ? `url(${f.img})` : 'unset',
                      width: CELL_SIZE / 2,
                      height: CELL_SIZE / 2,
                    }}
                    key={i}
                  />
                ))}
              </Stack>
            )}
          </Box>
        </Stack>
        <Stack sx={{ height: 'calc(100vh - 260px)', overflowY: 'auto' }}>
          <Typography sx={{ mb: 2 }} variant="h5">
            HISTORY
          </Typography>
          {history.map(({ from, to }, index) => (
            <Typography key={index} sx={{ mb: 0 }} variant="h6">
              {from.letter}
              {from.num}:{to.letter}
              {to.num}
            </Typography>
          ))}
        </Stack>
      </Stack>
    </Box>
  );
};

export const letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
export const nums = Array.from({ length: 8 });
export const deeps = Array.from({ length: 5 });

export default Chess;
