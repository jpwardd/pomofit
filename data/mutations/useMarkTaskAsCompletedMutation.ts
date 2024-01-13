import { supabase } from "../supabase";
import { useMutation, useQueryClient } from '@tanstack/react-query';

const markTaskAsCompleted = async (task: any) => {
  const { data, error } = await supabase
    .from('tasks')
    .update({ completed: !task.completed })
    .eq('task_id', task.task_id)
    .select();

    console.log('markTaskAsCompleted');
  if (error) {
    throw new Error(error.message)
  }

  return data;
}

export const useMarkTaskAsCompletedMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({mutationFn: markTaskAsCompleted,
  onMutate: async (task) => {
    await queryClient.cancelQueries({ queryKey: ['task', task.task_id] })
    const previousTask = queryClient.getQueryData(['task', task.task_id])
    const previousTasks = queryClient.getQueryData(['tasks'])

    console.log('prevTask', previousTask);
    console.log('task', task);
    queryClient.setQueryData(['task', task.task_id], (old: any) => {
      if (!old) {
        return;
      }
      console.log('oldSingle', old);
      return {
        ...old,
        completed: !old.completed,
      }
    })

    queryClient.setQueryData(['tasks'], (old: any) => {
      console.log('old', old);
      if (!old) {
        return;
      }

      return old.map((t: any) => {
        if (t.task_id === task.task_id) {
          return {
            ...t,
            completed: !t.completed,
          }
        }
        return t;
      })
    })

    return { previousTask, task, previousTasks }
  },
  onError: (err, newTask, context) => {
    queryClient.setQueryData(['task', context?.task.task_id], context?.previousTask)
    queryClient.setQueryData(['tasks'], context?.previousTasks)
  },
  onSettled: (data) => {
    queryClient.invalidateQueries({ queryKey: ['task', data[0].task_id] });
    queryClient.invalidateQueries({ queryKey: ['tasks'] });
  }
});
}