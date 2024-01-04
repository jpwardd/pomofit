import { View, Text } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'
import TimerScreen from '../../../components/timer/TimerScreen'

type Props = {}

const Timer = (props: Props) => {
  return (
    <>
      <Stack.Screen 
        options={{ 
          headerStyle: { backgroundColor: 'black' }, 
          headerTitle: '',
          headerShadowVisible: false,
        }} 
      />
      <TimerScreen />
    </>
  )
}

export default Timer;