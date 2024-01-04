import React from 'react'
import { View, Text, Box, Button, ButtonText, Checkbox, CheckboxIndicator, CheckboxLabel, HStack, useToken } from '@gluestack-ui/themed'
import { FontAwesome, MaterialIcons } from '@expo/vector-icons'; 
import { Link, useRouter } from 'expo-router';
import { TouchableOpacity } from 'react-native';
import { AnimatedKeyboardInfo } from 'react-native-reanimated';


type Props = {
  item: any;
  onLongPress?: () => void
  isActive?: boolean
  isTimerScreen?: boolean
}

const ListItem = ({ item, onLongPress, isActive, isTimerScreen }: Props) => {
  const router = useRouter();
  return (
      <TouchableOpacity 
        onPress={() => router.push(`/tasks/${item.task_id}`)}
      
        onLongPress={onLongPress}
        disabled={isActive}
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
          <Checkbox size='md' value={item.task_id} aria-label='task selection checkbox'>
            <HStack space='sm'>
              <CheckboxIndicator borderRadius='$full' />
              <CheckboxLabel color='white'>{item.title}</CheckboxLabel>
            </HStack>
          </Checkbox>
            <TouchableOpacity onPress={() => router.push(`/tasks/timer/${item.task_id}`)}>
              <HStack space='md' alignItems='center'>
                <Text color='$white' size='md'>0/{item.pomodoro_estimate}</Text>
                {!isTimerScreen && <MaterialIcons name='timer' size={30} color='tomato' />}
              </HStack>
            </TouchableOpacity>
      </Box>
    </TouchableOpacity>
  )
}

export default ListItem