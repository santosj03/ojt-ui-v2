// student-update-form.tsx
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
import { Student } from '@/constants/data';
import { useEffect } from 'react';

const studentFormSchema = z.object({
  firstname: z.string().min(1, { message: 'First name is required' }),
  lastname: z.string().min(1, { message: 'Last name is required' }),
  email: z.string().min(1, { message: 'Email is required' }),
  class_section: z.string().min(1, { message: 'Class section is required' }),
  gender: z.string().min(1, { message: 'Gender is required' }),
  designation: z.string().min(1, { message: 'Designation is required' })
});

type StudentFormSchemaType = z.infer<typeof studentFormSchema>;

const StudentUpdateModal = ({
  studentData,
  modalClose
}: {
  studentData: Student;
  modalClose: () => void;
}) => {
  const form = useForm<StudentFormSchemaType>({
    resolver: zodResolver(studentFormSchema),
    defaultValues: {
      firstname: '',
      lastname: '',
      email: '',
      class_section: '',
      gender: '',
      designation: ''
    }
  });

  useEffect(() => {
    if (studentData) {
      form.reset({
        firstname: studentData.firstname,
        lastname: studentData.lastname,
        email: studentData.email,
        class_section: studentData.class_section,
        gender: studentData.gender,
        designation: studentData.designation
      });
    }
  }, [studentData]);

  const onSubmit = async (formData: StudentFormSchemaType) => {
    const token = localStorage.getItem('token');

    try {
      await axios.post(
        `http://127.0.0.1:8000/api/student/update/${studentData.id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      alert('Student updated!');
      modalClose();
    } catch (err) {
      console.error('Error updating student:', err);
      alert('Error updating student. Please try again.');
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
              'firstname',
              'lastname',
              'email',
              'class_section',
              'gender',
              'designation'
            ].map((fieldName) => (
              <FormField
                key={fieldName}
                control={form.control}
                name={fieldName as keyof StudentFormSchemaType}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-gray-700">
                      {fieldName.replace('_', ' ')}
                    </FormLabel>
                    <FormControl>
                      {/* <Input
                        placeholder={`Enter your ${fieldName.replace('_', ' ')}`}
                        {...field}
                        className="px-4 py-6 shadow-inner drop-shadow-xl"
                      /> */}
                      {fieldName === 'gender' ? (
                        <select
                          {...field}
                          className="w-full appearance-none rounded-md border border-gray-300 bg-transparent px-4 py-2 text-gray-500 shadow-inner focus:outline-none"
                        >
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
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
              Update Student
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default StudentUpdateModal;
