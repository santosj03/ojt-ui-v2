import { checkAttendace, getStudents, getTasks, logStudent } from '@/lib/api';
import { useMutation, useQuery } from '@tanstack/react-query';

export const useGetStudents = (offset, pageLimit, queryInput) => {
  return useQuery({
    queryKey: ['students', offset, pageLimit, queryInput],
    queryFn: async () => getStudents(offset, pageLimit, queryInput)
  });
};

export const useGetTasks = (offset, pageLimit, queryInput) => {
  return useQuery({
    queryKey: ['tasks', offset, pageLimit, queryInput],
    queryFn: async () => getTasks(offset, pageLimit, queryInput)
  });
};

export const useCheckAttendance = (queryInput) => {
  return useQuery({
    queryKey: ['refno', queryInput],
    queryFn: async () => checkAttendace(queryInput)
  });
};

// export const useLogStudent = (queryInput) => {
//   return useQuery({
//     queryKey: ['id', queryInput],
//     queryFn: async () => logStudent(queryInput)
//   });
// };

export const useLogStudent = (options = {}) => {
  return useMutation({
    mutationFn: (id: number) => logStudent(id),
    ...options
  });
};
