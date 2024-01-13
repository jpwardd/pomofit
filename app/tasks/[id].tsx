import { Box, Center, Text } from '@gluestack-ui/themed'
import React from 'react'
import { Stack, useGlobalSearchParams } from 'expo-router'
import { useGetTaskByIdQuery } from '../../data/queries/getTaskByIdQuery'

type Props = {}

const Task = (props: Props) => {
  // Get the task id from the route params and then fetch
  const { id } = useGlobalSearchParams();
  const { data: task, isLoading } = useGetTaskByIdQuery(+id as number);

  return (
    <>
      <Stack.Screen options={{ headerTitle: '' }} />

      {isLoading ? <Text>Loading...</Text> :
      <>
        <Center>
          <Text>{task?.title}</Text>
        </Center>
      </>
      }
    </>
  )
}

export default Task
