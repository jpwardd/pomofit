import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { Text, Box, Fab, FabIcon, Actionsheet, ActionsheetItem, ActionsheetContent, ActionsheetBackdrop, KeyboardAvoidingView } from '@gluestack-ui/themed';
import { format } from 'date-fns';
import ListItem from '../shared/ListItem';
import FaPlus from '../shared/icons/FaPlus';
import CreateTaskForm from '../forms/CreateTaskForm';
import { supabase } from '../../data/supabase';
import DraggableFlatList, { ScaleDecorator } from 'react-native-draggable-flatlist';

type Props = {};

const today = format(new Date(), "EEEE, MMMM d");

const getTasks = async () => {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .order('order_place')
    .eq('user_id', '2e6c2d35-99ce-46c6-9499-3cec2d25839c');

  if (error) {
    throw new Error('Error fetching tasks');
  }

  return data;
};

const reorderTasks = async (reorderedTasks: any) => {
  const { data, error } = await supabase
    .from('tasks')
    .upsert(reorderedTasks, { onConflict: 'task_id' })

  console.log('reorderTasks', data, error);
  if (error) {
    throw new Error(error.message)
  }

  return data;
}

const HomeScreen = (props: Props) => {
  const [showActionsheet, setShowActionsheet] = useState(false);
  const [tasks, setTasks] = useState([]);
  const taskInputRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getTasks();
      setTasks(data);
    };

    fetchData();
  }, []);

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

  const handleDragEnd = async (data: any) => {
    try {
      // Optimistic update: Update the local state with the new order
      setTasks(data);
  
      // Update the order_place field on each task
      const updatedTasks = data.map((task: any, index: number) => ({
        ...task,
        order_place: index + 1,
      }));
  
      await reorderTasks(updatedTasks);
    } catch (error) {
      console.error('Error during reorder:', error);
  
      const originalTasks = await getTasks();
  
      setTasks(originalTasks);
    }
  };

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
      <DraggableFlatList
        data={tasks}
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
