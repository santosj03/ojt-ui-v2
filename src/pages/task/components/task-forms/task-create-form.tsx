import Heading from '@/components/shared/heading';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import axios from 'axios';

const taskFormSchema = z.object({
  // student_id: z.string().min(1, { message: 'Student is required' }),
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

const TaskCreateModal = ({ modalClose }: { modalClose: () => void }) => {
  const form = useForm<TaskFormSchemaType>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {}
  });

  const onSubmit = async (formData: TaskFormSchemaType) => {
    const token = localStorage.getItem('token');
    const userString = localStorage.getItem('user');
    const user = userString ? JSON.parse(userString) : null;
    const payload = {
      ...formData,
      checked_by: user?.id, // Use optional chaining to avoid crash if user is null
      student_id: 16 //change this to the selected student id
    };

    try {
      await axios.post(`${apiBaseUrl}/task/create`, payload, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      alert('Task saved!');
      modalClose();
    } catch (err) {
      console.error('Error saving task:', err);
    }
  };

  return (
    <div className="px-2">
      <Heading
        title={'Create New Task'}
        description={''}
        className="space-y-2 py-4 text-center"
      />
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
                    <FormControl>
                      <Input
                        placeholder={`Enter your ${fieldName.replace('_', ' ')}`}
                        {...field}
                        className="px-4 py-6 shadow-inner drop-shadow-xl"
                      />
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
              Create Task
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default TaskCreateModal;
