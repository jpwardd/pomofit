import { View, Text } from 'react-native'
import React, { Dispatch, SetStateAction, useCallback } from 'react'
import { Box, Input, InputField } from '@gluestack-ui/themed'
import { useForm, Controller } from "react-hook-form"
import { supabase } from '../../data/supabase'
import { useMutation, useQueryClient } from '@tanstack/react-query';

type Props = {
  onSubmitEditing: () => void
  setTaskId: any
}

const createTask = async (data: any) => {
  const { error, data: taskId } = await supabase
        .from('tasks')
        .insert({ title: data.taskName, pomodoro_estimate: 3, user_id: '2e6c2d35-99ce-46c6-9499-3cec2d25839c' })
        .select('task_id')
}

const CreateTaskForm = ({ onSubmitEditing, setTaskId }: Props) => {
  const { control, handleSubmit } = useForm()
  const queryClient = useQueryClient();
  const { mutateAsync: createTaskAsync } = useMutation({ mutationFn: createTask, onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['tasks'] });
  }  })

  const onSubmit = async (data: any) => {
    if (data.taskName === '' || data.taskName === undefined) {
      onSubmitEditing();
      return;
    }
    
    await createTaskAsync(data);
     
      onSubmitEditing();
      console.log('data', data);
  }

  return (
    <Box width='100%'>
      <Controller
        render={({ field: { onChange, onBlur, value } }) => (
          <Input width='100%'>
            <InputField 
              onSubmitEditing={handleSubmit(onSubmit)} 
              placeholder='Enter a task' 
              onChangeText={onChange}
              value={value}
              autoFocus 
            />
          </Input>
        )}
        control={control}
        name='taskName'
       />
    </Box>
  )
}

export default CreateTaskForm