import { QueryClient, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../supabase";

const reorderTasks = async (reorderedTasks: any) => {
  const { data, error } = await supabase
    .from('tasks')
    .upsert(reorderedTasks, { onConflict: 'task_id' })

  if (error) {
    throw new Error(error.message)
  }

  return data;
}

const updateOrderPlace = async (taskId: number, orderPlace: number) => {
  console.log('task id', taskId, orderPlace);
  const { data, error } = await supabase
    .from('tasks')
    .update({ order_place: orderPlace })
    .eq('task_id', taskId)
    .select();

  console.log('here');

  if (error) {
    throw new Error(error.message);
  }

  return data;
};


export const useReorderTaskMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({ 
    mutationFn: async (variables: { taskId: number, orderPlace: number }) => {
      const { taskId, orderPlace } = variables;
      return updateOrderPlace(taskId, orderPlace);
    },
    onMutate: (newOrder) => {
      queryClient.setQueryData(['tasks'], newOrder)
    }
  });
}
