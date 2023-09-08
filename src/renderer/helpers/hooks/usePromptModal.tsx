import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Modal from '../../components/Modal';
import { ThemeProvider } from '@mui/material/styles';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useTheme } from '@mui/material';

type PromptResult =
  | {
      success: true;
      value: string;
    }
  | {
      success: false;
    };

interface PromptModalSubmitForm {
  value: string;
}

interface PromptModalProps {
  title: string;
  onDone: (result: PromptResult) => void;
  confirmText: string;
  declineText: string;
  defaultValue: string;
}

const PromptModal = ({
  title,
  onDone,
  confirmText,
  declineText,
  defaultValue,
}: PromptModalProps) => {
  const [open, setOpen] = useState(true);

  const theme = useTheme();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<PromptModalSubmitForm>({
    resolver: yupResolver(validationSchema),
  });

  const onClose = () => {
    onDone({ success: false });
    setOpen(false);
  };

  const onConfirm = (data: PromptModalSubmitForm) => {
    onDone({ success: true, value: data.value });
    setOpen(false);
  };

  useEffect(() => {
    setValue('value', defaultValue);
  }, [defaultValue]);

  return (
    <ThemeProvider theme={theme}>
      <Modal
        modalProps={{ width: 'auto', minWidth: '350px' }}
        open={open}
        title={title}
        onClose={onClose}
      >
        <Stack sx={{ mt: '10px' }} spacing={2} justifyContent="space-between">
          <TextField
            variant="outlined"
            error={!!errors.value}
            helperText={errors.value?.message}
            {...register('value')}
            InputProps={{
              style: {
                color: 'white',
              },
            }}
            sx={{
              backgroundColor: '#353535',
              '& .MuiOutlinedInput-root': {
                '&.Mui-focused fieldset': {
                  borderColor: 'transparent',
                },
              },
            }}
          />
          <Stack
            sx={{ mt: '20px' }}
            direction="row"
            spacing={2}
            justifyContent="space-between"
          >
            <Button
              sx={{ minWidth: '80px', color: 'white' }}
              variant="outlined"
              onClick={onClose}
            >
              {declineText}
            </Button>
            <Button
              variant="contained"
              sx={{ minWidth: '80px', backgroundColor: '#954da4' }}
              onClick={handleSubmit(onConfirm)}
            >
              {confirmText}
            </Button>
          </Stack>
        </Stack>
      </Modal>
    </ThemeProvider>
  );
};

const usePromptModal = () => {
  const handlePrompt = async (
    title: string,
    defaultValue = '',
    confirmText = 'Yes',
    declineText = 'Cancel'
  ): Promise<PromptResult> => {
    return new Promise((resolve) => {
      const root = ReactDOM.createRoot(
        document.getElementById('modals-container')!
      );
      root.render(
        <PromptModal
          title={title}
          defaultValue={defaultValue}
          confirmText={confirmText}
          declineText={declineText}
          onDone={(result) => resolve(result)}
        />
      );
    });
  };

  return { handlePrompt };
};

const validationSchema = yup.object({
  value: yup.string().required('This field is required'),
});

export default usePromptModal;
