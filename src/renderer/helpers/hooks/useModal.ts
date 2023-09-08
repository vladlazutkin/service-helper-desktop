import { useState } from 'react';

const useModal = (defaultOpen = false): [boolean, () => void, () => void] => {
  const [open, setOpen] = useState(defaultOpen);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return [open, handleOpen, handleClose];
};

export default useModal;
