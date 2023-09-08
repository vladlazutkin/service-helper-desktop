import React, { KeyboardEvent, useEffect, useState } from 'react';
import Modal from '../Modal';
import Button from '@mui/material/Button';
import { SelectChangeEvent } from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import Checkbox from '@mui/material/Checkbox';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import {
  TrelloColumn,
  TrelloComment,
  TrelloItem,
  TrelloLabel,
} from '../../interfaces';
import { useDebounce } from '../../helpers/hooks/useDebounce';
import LabelService from '../../services/trello/LabelsService';
import { useParams } from 'react-router-dom';
import { isMobile } from '../../helpers/isMobile';
import Box from '@mui/material/Box';
import CommentssService from '../../services/trello/CommentssService';
import { getImg } from '../../helpers/getImg';
import Avatar from '@mui/material/Avatar';
import { formatDistance } from 'date-fns';
import Link from '@mui/material/Link';

interface CardModalProps {
  open: boolean;
  onClose: () => void;
  onRemove: () => void;
  item: TrelloItem;
  columns: TrelloColumn[];
  onUpdate: (item: Partial<TrelloItem>) => void;
}

const CardModal = ({
  open,
  item,
  onClose,
  onUpdate,
  onRemove,
  columns,
}: CardModalProps) => {
  const [title, setTitle] = useState(item.title);
  const [description, setDescription] = useState(item.description);
  const [columnId, setColumnId] = useState(item.column._id);
  const [labels, setLabels] = useState<TrelloLabel[]>([]);
  const [selectedLabels, setSelectedLabels] = useState<string[]>(
    item.labels.map((l) => l._id)
  );
  const [comments, setComments] = useState<TrelloComment[]>([]);
  const [commentText, setCommentText] = useState('');
  const [loading, setLoading] = useState(false);

  const { id: boardId } = useParams<{ id: string }>();
  const deferredTitle = useDebounce(title, 1000);
  const deferredDescription = useDebounce(description, 1000);

  const handleChangeLabels = (event: SelectChangeEvent<string[]>) => {
    const value = event.target.value;
    const ids = typeof value === 'string' ? value.split(',') : value;
    setSelectedLabels(ids);
  };

  useEffect(() => {
    onUpdate({ title: deferredTitle });
  }, [deferredTitle, deferredDescription, columnId]);

  useEffect(() => {
    onUpdate({ description: deferredDescription });
  }, [deferredDescription, columnId]);

  useEffect(() => {
    onUpdate({ column: { _id: columnId } as TrelloColumn });
  }, [columnId]);

  useEffect(() => {
    onUpdate({
      labels: selectedLabels.map((id) => ({ _id: id }) as TrelloLabel),
    });
  }, [selectedLabels]);

  useEffect(() => {
    CommentssService.getListForCard<TrelloComment[]>(item._id).then((data) =>
      setComments(data)
    );
  }, []);

  const handleRemove = async (id: string) => {
    await CommentssService.remove(id);
    CommentssService.getListForCard<TrelloComment[]>(item._id).then((data) =>
      setComments(data)
    );
  };

  const onAddComment = async (e: KeyboardEvent) => {
    if (e.key === 'Enter' && !!commentText && !e.shiftKey) {
      await CommentssService.create({
        text: commentText,
        cardId: item._id,
        boardId: item.board,
        columnId: item.column._id,
      });
      CommentssService.getListForCard<TrelloComment[]>(item._id).then((data) =>
        setComments(data)
      );
      setCommentText('');
    }
  };

  useEffect(() => {
    setLoading(true);
    LabelService.getListForBoard<TrelloLabel[]>(boardId!).then((data) =>
      setLabels(data)
    );
    setLoading(false);
  }, []);

  return (
    <Modal
      modalProps={
        isMobile()
          ? {
              width: '100%',
              height: '100vh',
              overflow: 'auto',
            }
          : {
              width: '70%',
              maxWidth: '800px',
              minWidth: '400px',
              maxHeight: '80vh',
              overflow: 'auto',
            }
      }
      open={open}
      title="Edit card"
      onClose={onClose}
    >
      <Stack spacing={2} justifyContent="space-between">
        <InputLabel>Title</InputLabel>
        <TextField
          value={title}
          variant="outlined"
          placeholder="Enter title"
          onChange={(e) => setTitle(e.target.value)}
        />
        <InputLabel>In column</InputLabel>
        <Select
          sx={{ width: 'fit-content' }}
          value={columnId}
          onChange={(e) => setColumnId(e.target.value)}
        >
          {columns.map((col) => (
            <MenuItem key={col._id} value={col._id}>
              {col.title}
            </MenuItem>
          ))}
        </Select>
        <InputLabel>Labels</InputLabel>
        <Select
          sx={{ width: isMobile() ? '100%' : '50%' }}
          renderValue={(selected) =>
            selected.length
              ? selected
                  .map((id) => labels.find((l) => l._id === id)?.title)
                  .join(', ')
              : 'Pick labels'
          }
          placeholder="dsdsdsd"
          displayEmpty
          multiple
          value={selectedLabels}
          onChange={handleChangeLabels}
        >
          {!loading && !labels.length && (
            <MenuItem disabled>
              <ListItemText primary="No labels" />
            </MenuItem>
          )}
          {labels.map((label) => (
            <MenuItem key={label._id} value={label._id}>
              <Checkbox
                color="secondary"
                checked={selectedLabels.includes(label._id)}
              />
              <ListItemText
                sx={{ backgroundColor: label.color, p: 0 }}
                primary={label.title}
              />
            </MenuItem>
          ))}
        </Select>
        <InputLabel>Description</InputLabel>
        <TextField
          value={description}
          placeholder="Enter description"
          variant="outlined"
          rows={3}
          multiline
          onChange={(e) => setDescription(e.target.value)}
        />

        <Button
          sx={{ width: 'fit-content' }}
          color="error"
          variant="contained"
          onClick={onRemove}
        >
          Delete
        </Button>

        <Typography>ACTIVITY</Typography>
        <TextField
          value={commentText}
          placeholder="Enter comment"
          variant="outlined"
          rows={3}
          onKeyDown={onAddComment}
          multiline
          onChange={(e) => setCommentText(e.target.value)}
        />
        {comments
          .slice()
          .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))
          .map((c) => (
            <Stack
              sx={{ width: '100%' }}
              key={c._id}
              direction="row"
              spacing={2}
            >
              <Avatar
                alt={c.user.email ?? 'profile icon'}
                src={
                  c.user.profileIcon ? getImg(c.user.profileIcon) : undefined
                }
              />
              <Stack sx={{ width: '100%' }}>
                <Stack direction="row" spacing={1}>
                  <Typography fontWeight="bold">{c.user.email}</Typography>
                  <Typography color="text.secondary">
                    {formatDistance(new Date(c.createdAt), new Date(), {
                      addSuffix: true,
                    })}
                  </Typography>
                </Stack>
                <Box
                  sx={{
                    backgroundColor: '#c0c0c0',
                    color: 'black',
                    p: 1,
                    borderRadius: 3,
                  }}
                >
                  <Typography sx={{ whiteSpace: 'pre-line' }}>
                    {c.text}
                  </Typography>
                </Box>
                <Link color="#fff" href="#" onClick={() => handleRemove(c._id)}>
                  Delete
                </Link>
              </Stack>
            </Stack>
          ))}

        <Stack direction="row" spacing={2} justifyContent="space-between">
          <Button sx={{ color: 'white' }} variant="contained" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="contained"
            sx={{ backgroundColor: '#954da4' }}
            onClick={onClose}
          >
            OK
          </Button>
        </Stack>
      </Stack>
    </Modal>
  );
};

export default CardModal;
