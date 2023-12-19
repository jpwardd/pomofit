import { View, Text, SafeAreaView, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { Agenda } from 'react-native-calendars'
import { Box } from '@gluestack-ui/themed'
import WeekTaskSlider from '../shared/WeekTaskSlider'

type Props = {}
const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const HomeScreen = (props: Props) => {
  const [selectedDay, setSelectedDay] = useState(daysOfWeek[0]);
  return (
    <WeekTaskSlider />
     
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

