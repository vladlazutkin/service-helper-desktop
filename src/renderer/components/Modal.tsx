import React from 'react';
import Base from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Backdrop from '@mui/material/Backdrop';
import Fade from '@mui/material/Fade';
import { SxProps } from '@mui/system';

interface ModalProps {
  title?: string;
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  modalProps?: SxProps;
}

const Modal = ({
  open,
  onClose,
  children,
  title,
  modalProps = {},
}: ModalProps) => {
  return (
    <div>
      <Base
        open={open}
        onClose={onClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={open}>
          <Box sx={{ ...style, ...(modalProps as any) }}>
            {!!title && (
              <Typography variant="h5" fontWeight="bold" sx={{ mb: '20px' }}>
                {title}
              </Typography>
            )}
            {children}
          </Box>
        </Fade>
      </Base>
    </div>
  );
};

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '80%',
  outline: 'none',
  bgcolor: '#3b3b3b',
  boxShadow: 24,
  p: 4,
};

export default Modal;
