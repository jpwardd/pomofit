import React from 'react'
import { TouchableOpacity } from 'react-native'
import { supabase } from '../../data/supabase'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { FlatList, View, Text, Box, HStack, Divider, SectionList, Fab, FabIcon } from '@gluestack-ui/themed'
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import FaPlus from '../shared/icons/FaPlus';

type Props = {}

const getLists = async () => {
  const { data: lists, error } = await supabase
    .from('lists')
    .select(`list_id, name, company_curated, user_id`)
    .eq('user_id', '2e6c2d35-99ce-46c6-9499-3cec2d25839c')

  if (error) {
    console.error(error);
    throw error;
  }

  return lists;
}

const createList = async (list: any) => {
  const { data, error } = await supabase
    .from('lists')
    .insert(list)

  if (error) {
    console.error(error);
    throw error;
  }

  return data;
}

const ListScreen = (props: Props) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data, error, isLoading } = useQuery({ queryKey: ['lists', '2e6c2d35-99ce-46c6-9499-3cec2d25839c'], queryFn: getLists })
  const { mutateAsync: createListAsync } = useMutation({ 
    mutationFn: createList, 
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['lists', '2e6c2d35-99ce-46c6-9499-3cec2d25839c']}) 
  })

  const companyCurated = data?.filter((list: any) => list.company_curated === true);
  const userCurated = data?.filter((list: any) => list.company_curated === false);

  if (isLoading) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    )
  }

  const onCreateListPress = async () => {
    // I need to add a number to the list name if it already exists 
    const listNumber = (userCurated?.filter((list: any) => list.name?.includes('Untitled List'))?.length ?? 0) + 1;
    const list = {
      name: `Untitled List (${listNumber})`,
      company_curated: false,
      user_id: '2e6c2d35-99ce-46c6-9499-3cec2d25839c'
    }

    const res = await createListAsync(list);
    console.log(res);
    if (res) {

      router.push(`/(tabs)/lists/${res.list_id}`);
    }

  }


  return (
    <View backgroundColor='black' flex={1}>
      <SectionList 
        sections={[
          { title: '', data: companyCurated },
          { title: 'User Curated', data: userCurated },
        ]}
        keyExtractor={(item: any) => item.list_id}
        renderItem={({ item }: { item: any }) => (
          <Box margin='$3'>
            <HStack space='sm'>
              <MaterialIcons name="today" size={30} color="black" style={{ color: 'white'}} />
              <TouchableOpacity onPress={() => router.push(`/(tabs)/lists/${item.list_id}`)}>

                <Text color='$white' size='2xl'>{item.name}</Text>
              </TouchableOpacity>
            </HStack>
          </Box>
        )}
        renderSectionHeader={({ section: { title } }) => (
          title ? (
            <Box margin='$3'>
              <Divider />
            </Box>
          ) : null
        )}
      />
      <Fab size='lg' onPress={onCreateListPress}  bgColor='$yellow400'>
        <FabIcon as={FaPlus} color='black' />
      </Fab>
    </View>
  )
}

export default ListScreen