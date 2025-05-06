import { AlertModal } from '@/components/shared/alert-modal';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Task } from '@/constants/data';
import { Edit, MoreHorizontal, Trash } from 'lucide-react';
import { useState } from 'react';
import { UpdateModal } from './update-modal';
import axios from 'axios';

interface CellActionProps {
  data: Task;
}
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [loading] = useState(false);
  const [open, setOpen] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false); // for update modal

  const onConfirm = async () => {
    const token = localStorage.getItem('token');

    try {
      await axios.delete(`${apiBaseUrl}/task/delete/${data.id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      alert('Task deleted!');
    } catch (err) {
      console.error('Error deleteing task:', err);
      alert('Error deleting task. Please try again.');
    }
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onConfirm}
        loading={loading}
      />

      <UpdateModal
        isOpen={openUpdate}
        onClose={() => setOpenUpdate(false)}
        data={data}
      />

      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>

          <DropdownMenuItem onClick={() => setOpenUpdate(true)}>
            <Edit className="mr-2 h-4 w-4" /> Update
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setOpen(true)}>
            <Trash className="mr-2 h-4 w-4" /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
