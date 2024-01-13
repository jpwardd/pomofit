import { supabase } from '../../data/supabase';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const updatePomodorosCompleted = async (task: any) => {
  const { data, error } = await supabase
    .from('tasks')
    .update({ pomodoros_completed: task.pomodoros_completed + 1 })
    .eq('task_id', task.task_id)
    .select();

  if (error) {
    throw new Error(error.message)
  }

  return data;
}

export const useUpdatePomodorosCompletedMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({mutationFn: (task) => {
    return updatePomodorosCompleted(task);
  },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['task', data[0].task_id] });
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    }
  });
}
