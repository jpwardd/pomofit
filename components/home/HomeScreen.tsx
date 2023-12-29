import { View, SafeAreaView, StyleSheet, TouchableOpacity, Platform } from 'react-native'
import React, { useState, useRef, useEffect, useCallback } from 'react'
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
  Checkbox,
  FlatList,
  CheckboxIndicator,
  CheckboxLabel,
} from '@gluestack-ui/themed'
import WeekTaskSlider from '../shared/WeekTaskSlider'
import { format } from 'date-fns'
import CreateTaskForm from '../forms/CreateTaskForm'
import { supabase } from '../../data/supabase'
import { useQuery } from '@tanstack/react-query';
import ListItem from '../shared/ListItem'
import FaPlus from '../shared/icons/FaPlus'

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
  const { data: tasks } = useQuery({ queryKey: ['tasks'], queryFn: getTasks });

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
  const renderItem = useCallback(({ item }) => {
    return (
      <ListItem 
        value={item.task_id} 
        title={item.title} 
        pomodoroEstimate={item.pomodoro_estimate}
      />
    )
  }, []);

  return (
    <Box w='100%' height='100%' backgroundColor='black'>
    <Box flex={1} m='$1'>
      <Box mb='$2'>
        <Text  size='4xl' bold color='$yellow400'>
          Today
        </Text>
        <Text size='md' color='$yellow400'>{today}</Text>
      </Box>
      <FlatList 
        data={tasks}
        renderItem={renderItem}
        keyExtractor={item => item.task_id}
      />

      <Fab size='lg' onPress={openActionsheet} bgColor='$yellow400'>
        <FabIcon as={FaPlus} color='black' />
      </Fab>
      <Actionsheet
        isOpen={showActionsheet}
        onClose={handleClose}
        snapPoints={[50]}
        closeOnOverlayClick={true}
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
        <ActionsheetContent backgroundColor='$backgroundDark950'>
          <ActionsheetItem>
            <CreateTaskForm onSubmitEditing={onSubmitEditing} setTaskId={setTaskId} />
          </ActionsheetItem>
        </ActionsheetContent>
      </KeyboardAvoidingView>
    </Actionsheet>
    </Box>
  </Box>

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
