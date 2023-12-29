import { supabase } from '../supabase';
import { useQuery } from '@tanstack/react-query';

const fetchTaskById = async (id: number) => {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('task_id', id)
    .single();
  
  return data;
}

export const useGetTaskByIdQuery = (id: number) => {
  return useQuery({ queryKey: ['task', id], queryFn: () => fetchTaskById(id) });
}

