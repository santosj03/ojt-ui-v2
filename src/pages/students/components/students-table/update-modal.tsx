// components/shared/update-modal.tsx
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Student } from '@/constants/data';
import StudentUpdateModal from '../student-forms/student-update-form';

interface UpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: Student;
}

export const UpdateModal: React.FC<UpdateModalProps> = ({
  isOpen,
  onClose,
  data
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Update Student</DialogTitle>
        </DialogHeader>
        <StudentUpdateModal studentData={data} modalClose={onClose} />
      </DialogContent>
    </Dialog>
  );
};
