import { View, SafeAreaView, StyleSheet, TouchableOpacity, Platform } from 'react-native'
import React, { useState, useRef, useEffect } from 'react'
import { Agenda } from 'react-native-calendars'
import { 
  Box, 
  Fab, 
  FabLabel, 
  Text, 
  FabIcon, 
  Actionsheet, 
  ActionsheetContent, 
  ActionsheetItem, 
  Input,
  ActionsheetItemText,
  ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper,
  ActionsheetBackdrop,
  InputField,
  KeyboardAvoidingView,
  InputSlot,
  InputIcon,
  Button,
  ButtonText,
  FormControl,
  FormControlLabel,
  FormControlLabelText,
  Image,
  HStack,
  VStack,
  Center,
  useToken,
  useTheme,
  FlatList,
} from '@gluestack-ui/themed'
import WeekTaskSlider from '../shared/WeekTaskSlider'
import { format } from 'date-fns'
import CreateTaskForm from '../forms/CreateTaskForm'
import { supabase } from '../../data/supabase'
import { useQuery } from '@tanstack/react-query';

type Props = {}

const today = format(new Date(), "EEEE, MMMM d");

const getTasks = async () => {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('user_id', '2e6c2d35-99ce-46c6-9499-3cec2d25839c')
  console.log('data', data);
  console.log('error', error);


  return data;
}

const HomeScreen = (props: Props) => {
  const [showActionsheet, setShowActionsheet] = useState(false);
  const taskInputRef = useRef(null);
  const [taskId, setTaskId] = useState<null | number>(null);
  console.log('taskId', taskId);
  const { data: tasks } = useQuery({ queryKey: ['tasks', taskId], queryFn: getTasks });

  const handleClose = () => {
    console.log('handleClose');
    setShowActionsheet(false);
  }

  const openActionsheet = () => {
    setShowActionsheet(true);
  }

  console.log('showActionsheet', showActionsheet);
 
  const onSubmitEditing = () => {
    setShowActionsheet(false);
  }

  console.log('tasks', tasks);

  return (
    <>
    <Box flex={1}>
      <Text size='4xl' bold>
        Today
      </Text>
      <Text size='md'>{today}</Text>
      {/* Other content goes here */}
      <FlatList 
        data={tasks}
        renderItem={({ item }) => <Text>{item.title}</Text>}
        keyExtractor={item => item.task_id}
      />

      <Fab onPress={openActionsheet}>
        <FabIcon />
        <FabLabel>Add Task</FabLabel>
      </Fab>
      <Actionsheet
        isOpen={showActionsheet}
        onClose={handleClose}
        snapPoints={[50]}
        closeOnOverlayClick
        style={{ flex: 1 }}
      >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{
          position: "relative",
          flex: 1,
          justifyContent: "flex-end",
        }}
      >
        <ActionsheetContent backgroundColor='$backgroundDark900'>
          <ActionsheetItem>
            <CreateTaskForm onSubmitEditing={onSubmitEditing} setTaskId={setTaskId} />
          </ActionsheetItem>
        </ActionsheetContent>
      </KeyboardAvoidingView>
    </Actionsheet>
    </Box>
  </>

  )
}

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

export default HomeScreen
