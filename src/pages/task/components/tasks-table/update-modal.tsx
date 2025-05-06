// components/shared/update-modal.tsx
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Task } from '@/constants/data';
import TaskUpdateModal from '../task-forms/task-update-form';

interface UpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: Task;
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
          <DialogTitle>Update Task</DialogTitle>
        </DialogHeader>
        <TaskUpdateModal taskData={data} modalClose={onClose} />
      </DialogContent>
    </Dialog>
  );
};
