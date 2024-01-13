import { supabase } from '../supabase';
import { useQuery } from '@tanstack/react-query';

const fetchTaskById = async (id: number) => {
  console.log('fetchTaskById');
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('task_id', id)
    .single();
  
  return data;
}

export const useGetTaskByIdQuery = (taskId: number) => {
  return useQuery({ 
    queryKey: ['task', taskId], 
    queryFn: () => fetchTaskById(taskId),
  });
}

