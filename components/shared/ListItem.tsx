import React from 'react'
import { View, Text, Box, Button, ButtonText, Checkbox, CheckboxIndicator, CheckboxLabel, HStack, useToken } from '@gluestack-ui/themed'
import { FontAwesome, MaterialIcons } from '@expo/vector-icons'; 
import { Link, useRouter } from 'expo-router';
import { TouchableOpacity } from 'react-native';


type Props = {
  value: string
  title: string
  pomodoroEstimate: number
}

const ListItem = ({ value, title, pomodoroEstimate }: Props) => {
  console.log('value', value);
  const router = useRouter();
  return (
    <TouchableOpacity onPress={() => router.push(`/tasks/${value}`)}>
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
        <Checkbox size='md' value={value} aria-label='task selection checkbox'>
          <HStack space='sm'>
            <CheckboxIndicator borderRadius='$full' />
            <CheckboxLabel color='white'>{title}</CheckboxLabel>
          </HStack>
        </Checkbox>
        <HStack space='md' alignItems='center'>
          <Text color='$white' size='md'>0/{pomodoroEstimate}</Text>
          <MaterialIcons name='timer' size={25} color='tomato' />
        </HStack>
    </Box>
   </TouchableOpacity>
  )
}

export default ListItem