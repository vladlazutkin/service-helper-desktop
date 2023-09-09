import React, { useEffect, useState } from 'react';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Skeleton from '@mui/material/Skeleton';
import { array3 } from '../constants/skeletons';
import ChessSkinsService from '../services/ChessSkinsService';
import ChessConfigsService from '../services/ChessConfigsService';
import { CELL_SIZE } from './games/Chess';
import MiniChessBoard from '../components/MiniChessBoard';
import LoadingButton from '@mui/lab/LoadingButton';
import { loadStripe } from '@stripe/stripe-js';
import { ChessConfig, ChessSkin } from '../interfaces';
import useModal from '../helpers/hooks/useModal';
import Modal from '../components/Modal';
import { useSearchParams } from 'react-router-dom';
import Button from '@mui/material/Button';
import { isMobile } from '../helpers/isMobile';
import { config } from '../config';

const scale = isMobile() ? 0.8 : 0.5;

const Skins = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');
  const [skins, setSkins] = useState<ChessSkin[]>([]);
  const [activeConfig, setActiveConfig] = useState<ChessConfig>();

  const [loadingBuy, setLoadingBuy] = useState(false);
  const [loadingActivate, setLoadingActivate] = useState(false);

  const [open, handleOpen, handleClose] = useModal();

  const handleBuy = async (id: string) => {
    setLoadingBuy(true);
    try {
      const stripe = await loadStripe(config.REACT_APP_STRIPE_KEY);

      if (!stripe) {
        return;
      }
      const session = await ChessSkinsService.buy<{ id: string }>({ id });

      const result = await stripe.redirectToCheckout({
        sessionId: session.id,
      });

      if (result.error) {
        console.log(result.error);
      }
    } catch (e) {
      console.log(e);
    }
    setLoadingBuy(false);
  };

  const handleActivate = async (id: string) => {
    setLoadingActivate(true);
    await ChessConfigsService.edit(id);
    ChessConfigsService.get<ChessConfig>()
      .then((data) => setActiveConfig(data))
      .finally(() => setLoadingActivate(false));
  };

  const handleDeactivate = async (id: string) => {
    setLoadingActivate(true);
    await ChessConfigsService.edit(id);
    ChessConfigsService.get<ChessConfig>()
      .then((data) => setActiveConfig(data))
      .finally(() => setLoadingActivate(false));
  };

  useEffect(() => {
    setLoading(true);
    ChessSkinsService.getList<ChessSkin[]>().then((data) => {
      setSkins(data);
      setLoading(false);
    });
    ChessConfigsService.get<ChessConfig>().then((data) =>
      setActiveConfig(data),
    );
  }, []);

  useEffect(() => {
    if (searchParams.get('result')) {
      setResult(searchParams.get('result')!);
      handleOpen();
      setSearchParams({});
    }
  }, [searchParams]);

  return (
    <>
      <Container>
        <Stack
          flexWrap="wrap"
          justifyContent={isMobile() ? 'center' : 'initial'}
          useFlexGap
          direction="row"
          spacing={3}
        >
          {loading &&
            array3.map((_, i) => (
              <Stack alignItems="center" key={i} spacing={2}>
                <Skeleton variant="rounded" width="50%" height={22} />
                <Skeleton
                  variant="rounded"
                  width={CELL_SIZE * 8 * scale}
                  height={CELL_SIZE * 8.2 * scale}
                />
                <Skeleton variant="rounded" width="100%" height={60} />
              </Stack>
            ))}
          {skins.map((skin) => (
            <Stack key={skin._id} spacing={2}>
              <Typography textAlign="center" variant="h5">
                {skin.title}
              </Typography>
              <MiniChessBoard
                scale={scale}
                pieces={null}
                config={JSON.parse(skin.config)}
              />
              {!skin.bought && (
                <LoadingButton
                  loading={loadingBuy}
                  onClick={() => handleBuy(skin._id)}
                  sx={{
                    height: '60px',
                    backgroundColor: 'rgba(255,118,255,0.5)',
                  }}
                  variant="contained"
                >
                  Buy ({skin.price}$)
                </LoadingButton>
              )}
              {skin.bought && activeConfig?.chessSkin !== skin._id && (
                <LoadingButton
                  loading={loadingActivate}
                  sx={{
                    height: '60px',
                    backgroundColor: 'rgba(255,118,255,0.5)',
                  }}
                  onClick={() => handleActivate(skin._id)}
                  variant="contained"
                >
                  Activate
                </LoadingButton>
              )}
              {skin.bought && activeConfig?.chessSkin === skin._id && (
                <LoadingButton
                  loading={loadingActivate}
                  sx={{
                    height: '60px',
                    backgroundColor: 'rgba(255,118,255,0.5)',
                  }}
                  onClick={() => handleDeactivate(skin._id)}
                  variant="contained"
                >
                  Deactivate
                </LoadingButton>
              )}
            </Stack>
          ))}
        </Stack>
      </Container>
      <Modal
        modalProps={{ maxWidth: '400px' }}
        title={result === 'success' ? 'Payment successful' : 'Payment failed'}
        open={open}
        onClose={handleClose}
      >
        <Stack spacing={3}>
          <Typography>
            {result === 'success'
              ? 'Payment was successful. The skin will be added to your library after a successful transaction'
              : 'Payment failed. Please retry'}
          </Typography>
          <Button
            variant="contained"
            sx={{ backgroundColor: '#954da4', alignSelf: 'end' }}
            onClick={handleClose}
          >
            Close
          </Button>
        </Stack>
      </Modal>
    </>
  );
};

export default Skins;
