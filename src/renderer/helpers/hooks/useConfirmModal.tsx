import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Modal from '../../components/Modal';
import { ThemeProvider } from '@mui/material/styles';
import { useTheme } from '@mui/material';

interface ConfirmModalProps {
  title: string;
  onDone: (result: boolean) => void;
  confirmText: string;
  declineText: string;
}

const ConfirmModal = ({
  title,
  onDone,
  confirmText,
  declineText,
}: ConfirmModalProps) => {
  const [open, setOpen] = useState(true);

  const onClose = () => {
    onDone(false);
    setOpen(false);
  };

  const onConfirm = () => {
    onDone(true);
    setOpen(false);
  };

  const theme = useTheme();

  return (
    <ThemeProvider theme={theme}>
      <Modal
        modalProps={{ width: 'auto', minWidth: '250px' }}
        title={title}
        open={open}
        onClose={onClose}
      >
        <Stack
          sx={{ mt: '10px' }}
          direction="row"
          spacing={2}
          justifyContent="space-between"
        >
          <Button
            sx={{ minWidth: '80px' }}
            variant="contained"
            color="error"
            onClick={onClose}
          >
            {declineText}
          </Button>
          <Button
            sx={{ minWidth: '80px' }}
            variant="contained"
            onClick={onConfirm}
          >
            {confirmText}
          </Button>
        </Stack>
      </Modal>
    </ThemeProvider>
  );
};

const useConfirmModal = () => {
  const handleConfirm = async (
    title: string,
    confirmText = 'Yes',
    declineText = 'Cancel',
  ) => {
    return new Promise((resolve) => {
      const root = ReactDOM.createRoot(
        document.getElementById('modals-container')!,
      );
      root.render(
        <ConfirmModal
          title={title}
          confirmText={confirmText}
          declineText={declineText}
          onDone={(result) => resolve(result)}
        />,
      );
    });
  };

  return { handleConfirm };
};

export default useConfirmModal;
