import React, { Children, useEffect, useState } from 'react'
import { Pressable, StyleSheet } from 'react-native'
import { addDays, eachDayOfInterval, eachWeekOfInterval, subDays, format, startOfWeek, addWeeks, endOfWeek} from 'date-fns'
import PagerView from 'react-native-pager-view'
import { HStack, VStack, View, Text, Center, Box} from '@gluestack-ui/themed'
import { useNavigation } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Props = {
}

const currentDate = new Date();
const start = startOfWeek(currentDate);
const dates = eachWeekOfInterval({
  start: start,
  end: addWeeks(start, 4)
}).map(week => eachDayOfInterval({ start: week, end: endOfWeek(week) }));

function isSameDay(date1: Date, date2: Date) {
  return date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate();
}

const WeekTaskSlider = (props: Props) => {
  const [selectedDay, setSelectedDay] = useState(new Date());

  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      headerTitle: `${format(selectedDay, 'MMMM')} ${selectedDay.getDate()}`,
    });
    
  }, [selectedDay]);

  const onDateSelected = (date: Date) => {
    setSelectedDay(date);
  }

  const onPageSelected = (event: { nativeEvent: { position: number } }) => {
    const newWeek = dates[event.nativeEvent.position];
    const newSelectedDay = newWeek.find(day => day.getDay() === selectedDay.getDay());
    if (newSelectedDay) {
      setSelectedDay(newSelectedDay);
    }
  }

  const insets = useSafeAreaInsets();
    
  return (
    <Box flex={1} paddingBottom={insets.bottom} paddingLeft={insets.left} paddingRight={insets.right}>
        <PagerView style={{ height: 60 }} onPageSelected={onPageSelected}>
          {dates.map((week, index) => (
            <Box key={index}>
              <HStack justifyContent='space-around' backgroundColor='$white'>
                {week.map((day, index) => {
                  const dayOfWeek = format(day, 'EEEEEE');
                  const isSelected = isSameDay(day, selectedDay);
                  return (
                    <View key={index} marginTop='$1.5' marginBottom='$1.5'>
                          <Center>
                            <Pressable onPress={() => onDateSelected(day)}>
                              <Text>{dayOfWeek}</Text>
                              <Box borderRadius='$full' marginTop='$1.5' backgroundColor={isSelected ? '$amber100' : 'transparent'}>
                                <Text>{day.getDate()}</Text>
                              </Box>
                            </Pressable>
                          </Center>
                    </View>
                  );
                })}
              </HStack>
            </Box>
          ))}
        </PagerView>

        <Box flex={1}>
   
        </Box>
      </Box>
      );
    }

    const styles = StyleSheet.create({
  container: {
    // flex: 1,
  },
  row: {
    flexDirection: 'row',
  },
  selectedDay: {
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  pagerView: {
    flex: 1,
  },
  page: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
});

export default WeekTaskSlider;