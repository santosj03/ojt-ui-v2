import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Task } from '@/constants/data';
import { useEffect } from 'react';

const taskFormSchema = z.object({
  description: z.string().min(1, { message: 'Description is required' }),
  difficulty: z.preprocess(
    (val) => Number(val),
    z.number().min(1, { message: 'Difficulty is required' })
  ),
  start_date: z.string().min(1, { message: 'Start Date is required' }),
  end_date: z.string().min(1, { message: 'End Date is required' }),
  status: z.string().min(1, { message: 'Status is required' })
});

type TaskFormSchemaType = z.infer<typeof taskFormSchema>;
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

const TaskUpdateModal = ({
  taskData,
  modalClose
}: {
  taskData: Task;
  modalClose: () => void;
}) => {
  const form = useForm<TaskFormSchemaType>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      description: '',
      difficulty: 1,
      start_date: '',
      end_date: '',
      status: 'pending' // Default value for status
    }
  });

  useEffect(() => {
    if (taskData) {
      form.reset({
        description: taskData.description,
        difficulty: taskData.difficulty,
        start_date: taskData.start_date,
        end_date: taskData.end_date,
        status: taskData.status || 'pending' // Ensure a default if not provided
      });
    }
  }, [taskData]);

  const onSubmit = async (formData: TaskFormSchemaType) => {
    const token = localStorage.getItem('token');
    const userString = localStorage.getItem('user');
    const user = userString ? JSON.parse(userString) : null;
    const payload = {
      ...formData,
      checked_by: user?.id,
      student_id: taskData.student.id
    };

    try {
      await axios.post(`${apiBaseUrl}/task/update/${taskData.id}`, payload, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      alert('Task updated!');
      modalClose();
    } catch (err) {
      console.error('Error updating task:', err);
      alert('Error updating task. Please try again.');
    }
  };

  return (
    <div className="px-2">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4"
          autoComplete="off"
        >
          <div className="grid grid-cols-2 gap-x-8 gap-y-4">
            {[
              'description',
              'difficulty',
              'start_date',
              'end_date',
              'status'
            ].map((fieldName) => (
              <FormField
                key={fieldName}
                control={form.control}
                name={fieldName as keyof TaskFormSchemaType}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-gray-700">
                      {fieldName.replace('_', ' ')}
                    </FormLabel>
                    <FormControl>
                      {fieldName === 'difficulty' ? (
                        <select
                          {...field}
                          className="w-full appearance-none rounded-md border border-gray-300 bg-transparent px-4 py-2 text-gray-500 shadow-inner focus:outline-none"
                        >
                          <option value="">Select difficulty</option>
                          {[1, 2, 3, 4, 5].map((value) => (
                            <option key={value} value={value}>
                              {value}
                            </option>
                          ))}
                        </select>
                      ) : fieldName === 'start_date' ||
                        fieldName === 'end_date' ? (
                        <Input
                          type="date"
                          {...field}
                          className="px-4 py-6 shadow-inner drop-shadow-xl"
                        />
                      ) : fieldName === 'status' ? (
                        <select
                          {...field}
                          className="w-full appearance-none rounded-md border border-gray-300 bg-transparent px-4 py-2 text-gray-500 shadow-inner focus:outline-none"
                        >
                          <option value="pending">Pending</option>
                          <option value="in_progress">In Progress</option>
                          <option value="completed">Completed</option>
                        </select>
                      ) : (
                        <Input
                          placeholder={`Enter your ${fieldName.replace('_', ' ')}`}
                          {...field}
                          className="px-4 py-6 shadow-inner drop-shadow-xl"
                        />
                      )}
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
          </div>
          <div className="flex items-center justify-center gap-4">
            <Button
              type="button"
              variant="secondary"
              className="rounded-full"
              size="lg"
              onClick={modalClose}
            >
              Cancel
            </Button>
            <Button type="submit" className="rounded-full" size="lg">
              Update Task
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default TaskUpdateModal;
