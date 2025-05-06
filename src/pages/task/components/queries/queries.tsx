import { getTasks } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';

export const useGetTasks = (offset, pageLimit, queryInput) => {
  return useQuery({
    queryKey: ['tasks', offset, pageLimit, queryInput],
    queryFn: async () => getTasks(offset, pageLimit, queryInput)
  });
};
