import React, { useEffect, useState } from 'react';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { Note } from '../interfaces';
import LoadingButton from '@mui/lab/LoadingButton';
import NotesService from '../services/NotesService';
import { isMobile } from '../helpers/isMobile';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Skeleton from '@mui/material/Skeleton';
import { array3 } from '../constants/skeletons';
import { ReactComponent as Logo } from '../assets/images/vectors/create-new-note.svg';

interface NoteSubmitForm {
  text: string;
}

const Notes = () => {
  const [loading, setLoading] = useState(true);
  const [loadingAction, setLoadingAction] = useState(false);
  const [activeNoteId, setActiveNoteId] = useState('');
  const [notes, setNotes] = useState<Note[]>([]);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<NoteSubmitForm>({
    resolver: yupResolver(validationSchema),
  });

  const {
    register: registerEdit,
    handleSubmit: handleSubmitEdit,
    setValue: setValueEdit,
    formState: { errors: errorsEdit },
  } = useForm<NoteSubmitForm>({
    resolver: yupResolver(validationSchema),
  });

  const handleCreate = async (data: NoteSubmitForm) => {
    setLoadingAction(true);
    await NotesService.create({ text: data.text });
    setValue('text', '');
    NotesService.getList<Note[]>().then((data) => {
      setNotes(data);
      setLoadingAction(false);
    });
  };

  const handleEdit = async (id: string, data: NoteSubmitForm) => {
    setLoadingAction(true);
    await NotesService.edit(id, { text: data.text });

    NotesService.getList<Note[]>().then((data) => {
      setNotes(data);
      setActiveNoteId('');
      setValueEdit('text', '');
      setLoadingAction(false);
    });
  };

  const handleRemove = async (id: string) => {
    setLoadingAction(true);
    await NotesService.remove(id);
    NotesService.getList<Note[]>().then((data) => {
      setNotes(data);
      setLoadingAction(false);
    });
  };

  const handleChangeEdit = (note: Note) => {
    setActiveNoteId(note._id);
    setValueEdit('text', note.text);
  };

  useEffect(() => {
    setLoading(true);
    NotesService.getList<Note[]>().then((data) => {
      setNotes(data);
      setLoading(false);
    });
  }, []);

  return (
    <Container>
      {!!notes.length && !loading && (
        <Stack spacing={2} direction="column" alignItems="flex-start">
          <TextField
            rows={3}
            multiline
            variant="outlined"
            sx={{ width: isMobile() ? '100%' : '50%' }}
            placeholder="Note description"
            error={!!errors.text}
            helperText={errors.text?.message}
            {...register('text')}
          />
          <LoadingButton
            loading={loadingAction}
            variant="contained"
            component="label"
            onClick={handleSubmit(handleCreate)}
          >
            Create
          </LoadingButton>
        </Stack>
      )}

      <Stack sx={{ mt: '20px' }} spacing={3}>
        {loading && (
          <>
            {array3.map((_, i) => (
              <Stack
                key={i}
                direction="row"
                spacing={2}
                alignItems="flex-start"
              >
                <Skeleton
                  variant="rounded"
                  width={isMobile() ? '100%' : '50%'}
                  height={100}
                />
                <Stack justifyContent="space-between" sx={{ height: '101px' }}>
                  <Skeleton variant="rounded" height={40} width={83} />
                  <Skeleton variant="rounded" height={40} width={83} />
                </Stack>
              </Stack>
            ))}
          </>
        )}
        {!notes.length && !loading && (
          <Stack alignSelf="center" alignItems="center" spacing={3}>
            <Logo
              width="40vw"
              style={{ minWidth: '350px', maxWidth: '600px' }}
            />
            <Typography fontWeight="bold" variant="h5">
              No notes here. Create a new one
            </Typography>
            <TextField
              rows={3}
              multiline
              variant="outlined"
              fullWidth
              placeholder="Note description"
              error={!!errors.text}
              helperText={errors.text?.message}
              {...register('text')}
            />
            <LoadingButton
              loading={loadingAction}
              variant="contained"
              component="label"
              onClick={handleSubmit(handleCreate)}
            >
              Create
            </LoadingButton>
          </Stack>
        )}
        {notes
          .slice()
          .sort((a, b) => +new Date(b.updatedAt) - +new Date(a.updatedAt))
          .map((note) => (
            <Stack
              key={note._id}
              direction="row"
              spacing={2}
              alignItems="flex-start"
            >
              <TextField
                multiline
                rows={3}
                disabled={activeNoteId !== note._id}
                variant="outlined"
                {...(activeNoteId === note._id
                  ? {
                      ...registerEdit('text'),
                      error: !!errorsEdit.text,
                      helperText: errorsEdit.text?.message,
                    }
                  : { value: note.text })}
                sx={{ width: isMobile() ? '100%' : '50%' }}
              />
              <Stack justifyContent="space-between" sx={{ height: '102px' }}>
                {activeNoteId === note._id ? (
                  <LoadingButton
                    loading={loadingAction}
                    variant="contained"
                    onClick={handleSubmitEdit((data) =>
                      handleEdit(note._id, data)
                    )}
                  >
                    Save
                  </LoadingButton>
                ) : (
                  <LoadingButton
                    loading={loadingAction}
                    variant="contained"
                    onClick={() => handleChangeEdit(note)}
                  >
                    Edit
                  </LoadingButton>
                )}
                <LoadingButton
                  loading={loadingAction}
                  variant="contained"
                  color="error"
                  onClick={() => handleRemove(note._id)}
                >
                  Delete
                </LoadingButton>
              </Stack>
            </Stack>
          ))}
      </Stack>
    </Container>
  );
};

const validationSchema = yup.object({
  text: yup.string().required('Content is required'),
});

export default Notes;
