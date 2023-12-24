import { View, Text } from 'react-native'
import React, { Dispatch, SetStateAction, useCallback } from 'react'
import { Box, Input, InputField } from '@gluestack-ui/themed'
import { useForm, Controller } from "react-hook-form"
import { supabase } from '../../data/supabase'
// import { useRealm } from '@realm/react';
import { Task } from '../../data/mongodb/models/Task'

type Props = {
  onSubmitEditing: () => void
  setTaskId: any
}

const createTask = (data: any) => {
  
}

const CreateTaskForm = ({ onSubmitEditing, setTaskId }: Props) => {
  const { control, handleSubmit } = useForm()
  // const realm = useRealm();
  // const handleAddTask = useCallback(
  //   (data: any): void => {
  //     if (!data) {
  //       return;
  //     }

  //     // Everything in the function passed to "realm.write" is a transaction and will
  //     // hence succeed or fail together. A transcation is the smallest unit of transfer
  //     // in Realm so we want to be mindful of how much we put into one single transaction
  //     // and split them up if appropriate (more commonly seen server side). Since clients
  //     // may occasionally be online during short time spans we want to increase the probability
  //     // of sync participants to successfully sync everything in the transaction, otherwise
  //     // no changes propagate and the transaction needs to start over when connectivity allows.
  //     realm.write(() => {
  //       return realm.create(Task, {
  //         title: data.title,
  //         estimatedPomodoros: data.estimatedPomodoros,
  //         dueDate: data.dueDate,
  //         note: data.note
  //       });
  //     });
  //   },
  //   [realm],
  // );

  const onSubmit = async (data: any) => {
    if (data.taskName === '' || data.taskName === undefined) {
      onSubmitEditing();
      return;
    }

    createTask(data);
  // const { error, data: taskId } = await supabase
  //     .from('tasks')
  //     .insert({ title: data.taskName, pomodoro_estimate: 3, user_id: '2e6c2d35-99ce-46c6-9499-3cec2d25839c' })
  //     .select('task_id')
  
    // console.log('error', taskId);  
    // if (taskId && taskId) {
    //   setTaskId(taskId);
    // }
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