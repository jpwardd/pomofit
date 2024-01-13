import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { Text, Box, Fab, FabIcon, Actionsheet, ActionsheetItem, ActionsheetContent, ActionsheetBackdrop, KeyboardAvoidingView } from '@gluestack-ui/themed';
import { format } from 'date-fns';
import ListItem from '../shared/ListItem';
import FaPlus from '../shared/icons/FaPlus';
import CreateTaskForm from '../forms/CreateTaskForm';
import { supabase } from '../../data/supabase';
import DraggableFlatList, { NestableScrollContainer, NestableDraggableFlatList, ScaleDecorator } from 'react-native-draggable-flatlist';
import { useQueryClient, useQuery, useMutation } from '@tanstack/react-query';

type Props = {};

const today = format(new Date(), "EEEE, MMMM d");

const getTasks = async (completed: boolean) => {
  console.log('getTasks');
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('completed', completed)
    .order('order_place')
    .eq('user_id', '2e6c2d35-99ce-46c6-9499-3cec2d25839c');

  if (error) {
    throw new Error('Error fetching tasks');
  }

  return data;
};


const reorderTasks = async (reorderedTasks: any) => {
  console.log('reorderTasks');
  const { data, error } = await supabase
    .from('tasks')
    .upsert(reorderedTasks, { onConflict: 'task_id' })

  if (error) {
    throw new Error(error.message)
  }

  return data;
}

const HomeScreen = (props: Props) => {
  const [showActionsheet, setShowActionsheet] = useState(false);
  // const [tasks, setTasks] = useState([]);
  const taskInputRef = useRef(null);

  const queryClient = useQueryClient();
  const { data: incompleteTasks, isLoading: isIncompleteTasksLoading } = useQuery({ queryKey: ['tasks', false], queryFn: () => getTasks(false) });
  const { data: completedTasks, isLoading: isCompletedTasksLoading } = useQuery({ queryKey: ['tasks', true], queryFn: () => getTasks(true) });

  const reorderMutation = useMutation({
    mutationFn: reorderTasks,
    onMutate: async (newTasks) => {
      // Synchronous operation, no need for async/await here
      await queryClient.cancelQueries({ queryKey: ['tasks'] })

      const previousTasks = queryClient.getQueryData(['tasks']);
      
      // Update the local state optimistically
      queryClient.setQueryData(['tasks'], newTasks);
  
      // Return an object with previousTasks property
      return { previousTasks };
    },
    onError: (err, newTasks, context) => {
      // Rollback to previous state on error
      queryClient.setQueryData(['tasks'], context!.previousTasks);
    },
    onSettled: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['tasks']});
    }
  });

  const handleClose = () => {
    setShowActionsheet(false);
  };

  const openActionsheet = () => {
    setShowActionsheet(true);
  };

  const onSubmitEditing = () => {
    setShowActionsheet(false);
  };

  const keyExtractor = (item: any) => {
    return item.task_id;
  };

  const handleDragEnd = (data: any[]) => {
    // Merge incomplete and completed tasks into a single array
    const allTasks = [...data, ...completedTasks];
  
    // Update order_place for each task
    const reorderedTasks = allTasks.map((task, index) => ({
      ...task,
      order_place: index + 1,
    }));
  
    reorderMutation.mutate(reorderedTasks);
  };

  console.log('tasks', incompleteTasks);

  return (
    <Box w='100%' height='100%' backgroundColor='black'>
  <Box flex={1} m='$1'>
    <Box mb='$2'>
      <Text size='4xl' bold color='$yellow400'>
        Today
      </Text>
      <Text size='md' color='$yellow400'>
        {today}
      </Text>
    </Box>
    <Box flex={1}>
    <NestableScrollContainer>
    {incompleteTasks && (
      <NestableDraggableFlatList
        data={incompleteTasks}
        renderItem={({ item, drag, isActive }) => (
          <ScaleDecorator>
            <ListItem 
              item={item}
              key={item.task_id} 
              onLongPress={drag}
              isActive={isActive}
            />
          </ScaleDecorator>
        )}
        onDragEnd={({ data }) => handleDragEnd(data)}
        keyExtractor={keyExtractor}
      />
    )}
    {completedTasks && (
    <Box>

    <Text size='4xl' bold color='$yellow400'>
      Completed
    </Text>
      <NestableDraggableFlatList
        data={completedTasks}
        renderItem={({ item, drag, isActive }) => (
          <ScaleDecorator>
            <ListItem 
              item={item}
              key={item.task_id} 
              onLongPress={drag}
              isActive={isActive}
              />
          </ScaleDecorator>
        )}
        onDragEnd={() => {}}
        keyExtractor={keyExtractor}
        />
      </Box>
    )}
    </NestableScrollContainer>

      <Fab size='lg' onPress={openActionsheet} bgColor='$yellow400'>
        <FabIcon as={FaPlus} color='black' />
      </Fab>
    </Box>
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Actionsheet
        isOpen={showActionsheet}
        onClose={handleClose}
        closeOnOverlayClick={true}
        snapPoints={[50]} 
      >
        <ActionsheetBackdrop />
        <ActionsheetContent backgroundColor='$backgroundDark950'>
          <ActionsheetItem>
            <CreateTaskForm onSubmitEditing={onSubmitEditing} />
          </ActionsheetItem>
        </ActionsheetContent>
      </Actionsheet>
    </KeyboardAvoidingView>
  </Box>
</Box>

  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
  },
  day: {
    fontSize: 16,
  },
  selectedDay: {
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
});

export default HomeScreen;
