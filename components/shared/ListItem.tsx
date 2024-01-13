import React from 'react'
import { 
  View, 
  Text, 
  Box, 
  Button, 
  ButtonText, 
  Checkbox, 
  CheckboxIndicator, 
  CheckboxLabel, 
  HStack, 
  useToken, 
  CheckboxIcon, 
  CheckIcon
} from '@gluestack-ui/themed'
import { FontAwesome, MaterialIcons } from '@expo/vector-icons'; 
import { Link, useRouter } from 'expo-router';
import { TouchableOpacity } from 'react-native';
import { AnimatedKeyboardInfo } from 'react-native-reanimated';
import { useMarkTaskAsCompletedMutation } from '../../data/mutations/useMarkTaskAsCompletedMutation';

const FaCheckCirceO = (props: any) => (
  <FontAwesome name='check-circle-o' size={30} {...props} />
);


type Props = {
  item: any;
  onLongPress?: () => void
  isActive?: boolean
  isTimerScreen?: boolean
}

const ListItem = ({ 
  item, 
  onLongPress, 
  isActive, 
  isTimerScreen, 
  onChange 
}: Props) => {
  const router = useRouter();
  const { mutateAsync: markTaskCompletedAsync } = useMarkTaskAsCompletedMutation();

  const markTaskCompleted = async () => {
    await markTaskCompletedAsync(item);
  }

  return (
      <TouchableOpacity 
        onPress={() => router.push(`/tasks/${item.task_id}`)}
        onLongPress={onLongPress}
        disabled={item.completed || isActive}
        pressRetentionOffset={{ top: 20, left: 20, bottom: 20, right: 20 }}  
      >
        <Box 
          sx={{ 
            height: '$16', 
            flexDirection: 'row', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            padding: 10, 
            borderRadius: 5, 
            marginBottom: 10, 
            backgroundColor: '$backgroundDark950'
          }}
        >
          <Checkbox 
            onChange={markTaskCompleted} 
            size='md' 
            value={item.task_id} 
            isChecked={item.completed}
            aria-label='task selection checkbox'
          >
          <HStack space='sm'>
            <CheckboxIndicator mr='$2'>
              <CheckboxIcon as={CheckIcon} />
            </CheckboxIndicator>
            <CheckboxLabel color='white'>{item.title}</CheckboxLabel>
          </HStack>
        </Checkbox>
          <TouchableOpacity onPress={() => router.push(`/tasks/timer/${item.task_id}`)}>
            <HStack space='md' alignItems='center'>
              <Text color='$white' size='md'>{item.pomodoros_completed}/{item.pomodoro_estimate}</Text>
              {!isTimerScreen && <MaterialIcons name='timer' size={30} color='tomato' />}
            </HStack>
          </TouchableOpacity>
      </Box>
    </TouchableOpacity>
  )
}

export default ListItem