import { AlertModal } from '@/components/shared/alert-modal';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Student } from '@/constants/data';
import { Edit, MoreHorizontal, Trash } from 'lucide-react';
import { useState } from 'react';
import { UpdateModal } from './update-modal';
import axios from 'axios';

interface CellActionProps {
  data: Student;
}

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [loading] = useState(false);
  const [openDelete, setOpenDelete] = useState(false); // for delete modal
  const [openUpdate, setOpenUpdate] = useState(false); // for update modal

  const onConfirmDelete = async () => {
    const token = localStorage.getItem('token');

    try {
      await axios.delete(`${apiBaseUrl}/student/delete/${data.id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      alert('Student deleted!');
    } catch (err) {
      console.error('Error updating student:', err);
      alert('Error updating student. Please try again.');
    }
  };

  return (
    <>
      <AlertModal
        isOpen={openDelete}
        onClose={() => setOpenDelete(false)}
        onConfirm={onConfirmDelete}
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
          <DropdownMenuItem onClick={() => setOpenDelete(true)}>
            <Trash className="mr-2 h-4 w-4" /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
