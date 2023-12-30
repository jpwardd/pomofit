import React from 'react'
import { View, Text, Box, Button, ButtonText, Checkbox, CheckboxIndicator, CheckboxLabel, HStack, useToken } from '@gluestack-ui/themed'
import { FontAwesome, MaterialIcons } from '@expo/vector-icons'; 
import { Link, useRouter } from 'expo-router';
import { TouchableOpacity } from 'react-native';
import { AnimatedKeyboardInfo } from 'react-native-reanimated';
import { ScaleDecorator } from 'react-native-draggable-flatlist';


type Props = {
  item: any;
  onLongPress: () => void
  isActive: boolean

}

const ListItem = ({ item, onLongPress, isActive }: Props) => {
  const router = useRouter();
  return (
    <ScaleDecorator>
      <TouchableOpacity 
        onPress={() => router.push(`/tasks/${item.task_id}`)}
        onLongPress={onLongPress}
        disabled={isActive}
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
          <HStack space='md' alignItems='center'>
            <Text color='$white' size='md'>0/{item.pomodoro_estimate}</Text>
            <MaterialIcons name='timer' size={25} color='tomato' />
          </HStack>
      </Box>
    </TouchableOpacity>
    </ScaleDecorator>
  )
}

export default ListItem