import React from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { RoutesPath } from '../../constants/route-paths';
import Divider from '@mui/material/Divider';
import CasinoIcon from '@mui/icons-material/Casino';
import GridViewIcon from '@mui/icons-material/GridView';
import FlagCircleIcon from '@mui/icons-material/FlagCircle';
import WorkspacesIcon from '@mui/icons-material/Workspaces';
import CallIcon from '@mui/icons-material/Call';
import ViewInArIcon from '@mui/icons-material/ViewInAr';
import Container from '@mui/material/Container';
import { DrawerRoute } from '../../interfaces';
import { useTheme } from '@mui/material';

const games: DrawerRoute[] = [
  {
    icon: CasinoIcon,
    path: RoutesPath.GAMES_CHESS,
    title: 'Chess',
  },
  {
    icon: GridViewIcon,
    path: RoutesPath.GAMES_CHECKERS,
    title: 'Checkers',
  },
  {
    icon: FlagCircleIcon,
    path: RoutesPath.GAMES_SAPPER,
    title: 'Sapper',
  },
  {
    icon: WorkspacesIcon,
    path: RoutesPath.GAMES_ARKANOID,
    title: 'Arkanoid',
  },
  {
    icon: CallIcon,
    path: RoutesPath.GAMES_CALL,
    title: 'Call',
  },
  {
    icon: ViewInArIcon,
    path: RoutesPath.GAMES_CUBELLO,
    title: 'Cubello',
  },
  {
    icon: ViewInArIcon,
    path: RoutesPath.GAMES_CUBCHIK,
    title: 'Cubchik',
  },
  {
    icon: ViewInArIcon,
    path: RoutesPath.GAMES_TERRARIA,
    title: 'Terraria',
  },
]
  .slice()
  .sort((a, b) => a.title.localeCompare(b.title));

const Games = () => {
  const navigate = useNavigate();
  const theme = useTheme();

  return (
    <Container>
      <Stack spacing={2}>
        {games.map((route, index) => (
          <Card
            key={route.path}
            onClick={() => navigate(route.path)}
            sx={{
              backgroundColor: theme.palette.secondary.main,
              cursor: 'pointer',
            }}
          >
            <CardContent>
              <Typography>{route.title}</Typography>
            </CardContent>
            {index !== games.length - 1 && <Divider />}
          </Card>
        ))}
      </Stack>
    </Container>
  );
};

export default Games;
