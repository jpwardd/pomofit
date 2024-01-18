import React from 'react'
import { Box, Text, View, InputField, Input } from '@gluestack-ui/themed';
import { Stack, useLocalSearchParams } from 'expo-router'
import { supabase } from '../../../data/supabase';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const getListById = async (listId: string) => {
  const { data: list, error } = await supabase
    .from('lists')
    .select(`list_id, name, company_curated, user_id, tasks ( task_id, title, completed, order_place, pomodoro_estimate, pomodoros_completed)`)
    .eq('list_id', +listId)
    .single()

  if (error) {
    console.error(error);
    throw error;
  }

  return list;
}

type Props = {}

const ListDetailPage = (props: Props) => {
  const { id } = useLocalSearchParams();

  const { data: list, error, isLoading } = useQuery({ queryKey: ['list', id], queryFn: () => getListById(id as string) })
  console.log('list', list)

  return (
    <>
     <Stack.Screen options={{ title: '' }}/>
      <Box>
        <Input
          variant="outline"
          size="md"
          isDisabled={false}
          isInvalid={false}
        >
          <InputField defaultValue={list.name} placeholder={list.name} />
        </Input>
      </Box>
    </>
  )
}

export default ListDetailPage;
