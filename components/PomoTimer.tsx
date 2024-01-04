import { Box, Button, ButtonText, Center, HStack, Text, ButtonGroup, VStack, Divider } from '@gluestack-ui/themed';
import { AppState, AppStateStatus, Dimensions, TouchableOpacity } from 'react-native';
import React, { useState, useRef, useEffect } from 'react'
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { differenceInSeconds } from "date-fns";
import Svg, { Circle } from 'react-native-svg';
import Animated, { useAnimatedProps, useSharedValue, withTiming } from 'react-native-reanimated';
import ListItem from './shared/ListItem';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const PlayIcon = (props: any) => (
  <Ionicons name='md-play' {...props} />
);

const PauseIcon = (props: any) => (
  <Ionicons name='md-pause' {...props} />
);

const CIRCLE_LENGTH = 1000;
const R = CIRCLE_LENGTH / (2 * Math.PI);

const { width } = Dimensions.get('window');
const circleSize = width - 60;
const strokeWidth = 30;
const radius = (circleSize - strokeWidth) / 2;
const circumference = radius * 2 * Math.PI;

const PomoTimer = () => {
  const [time, setTime] = useState(5);
  const [timerStart, setTimerStart] = useState(false);
  const [initialStartTime, setInitialStartTime] = useState(0);
  const [activeTimer, setActiveTimer] = useState('Focus');
  // Storage when app is in background
  const appState = useRef(AppState.currentState);
  const [elapsed, setElapsed] = useState(0);
  const progress = useSharedValue(1); // starts from 1 (full circumference)

  const animatedProps = useAnimatedProps(() => {
    const strokeDashoffset = progress.value;
    return { strokeDashoffset };
  });

  const toggleTimer = () => {
    if (!timerStart) {
      recordStartTime();
      progress.value = withTiming(circumference, { duration: time * 1000 }); // start the animation
    }
  
    setTimerStart(!timerStart);
  };

  const reset = () => {
    // I need to reset the time to the default time set by the user in the settings I think these setting can be stored in async storage
    setTime(5);
    setTimerStart(false);
    progress.value = 0;
  }

  const recordStartTime = async () => {
    try {
      const now = new Date();
      await AsyncStorage.setItem("@start_time", now.toISOString());
    } catch (err) {
      // TODO: handle errors from setItem properly
      console.warn(err);
    }
  };

  const getElapsedTime = async () => {
    try {
      const startTime = await AsyncStorage.getItem("@start_time");

      if (!startTime) {
        return 0;
      }

      const now = new Date();
      return differenceInSeconds(now, Date.parse(startTime));
    } catch (err) {
      // TODO: handle errors from setItem properly
      console.warn(err);
    }
  };

  useEffect(() => {
    const handleAppStateChange = async (nextAppState: AppStateStatus) => {
      if ((appState.current as AppStateStatus).match(/inactive|background/) &&
        nextAppState === "active") {
        // We just became active again: recalculate elapsed time based 
        // on what we stored in AsyncStorage when we started.
        const elapsed = await getElapsedTime();
        // Update the elapsed seconds state
        setElapsed(elapsed || 0);
      }
      appState.current = nextAppState;
    };

    const subscription = AppState.addEventListener("change", handleAppStateChange);
    return () => {
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    let interval = null;
    if (timerStart) {
      interval = setInterval(() => {
        setTime((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(interval);
            setTimerStart(false);
            return 0;
          } else {
            return prevTime - 1;
          }
        });
      }, 1000);
    } else if (!timerStart && time !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timerStart, time]);


  // useEffect(() => {
  //   if (time <= 0) {
  //     progress.value = 0;
  //     movetoNextTimer();
  //   }
  // }, [time]);

  const movetoNextTimer = () => {
    setTimerStart(false); // reset the timerStart state
    switch (activeTimer) {
      case 'Focus':
        setTime(5 * 60);
        setActiveTimer('Short Break');
        break;
      case 'Short Break':
        console.log('short break');
        setTime(25 * 60);
        setActiveTimer('Focus');
        break;
      default:
        setTime(25 * 60);
        setActiveTimer('Focus');
    }
  }

const handleFocusPress = (): void => {
    progress.value = 0;
    setTimerStart(false);
    setTime(25 * 60);
    setActiveTimer('Focus');
}

const handleShortBreakPress = (): void => {
    progress.value = 0;
    setTimerStart(false);
    setTime(5 * 60);
    setActiveTimer('Short Break');
}

const handleLongBreakPress = (): void => {
    progress.value = 0;
    setTimerStart(false);
    setTime(15 * 60);
    setActiveTimer('Long Break');
}
  
return (
    <Box sx={{ bg: 'black', w: '100%', h: '100%'}}>
      <Center>
        <HStack space='sm' mt='$10' mb='$2.5'>
          <Box h='100%' bg={activeTimer === 'Focus' ? '$backgroundDark950' : 'transparent'} p='$2' borderRadius='$lg'>
            <TouchableOpacity onPress={handleFocusPress}>
              <Text color={activeTimer === 'Focus' ? '$yellow400' : '$white'}>Focus</Text>
            </TouchableOpacity>
          </Box>
          <Box h='100%' bg={activeTimer === 'Short Break' ? '$backgroundDark950' : 'transparent'} p='$2' borderRadius='$lg'>
            <TouchableOpacity onPress={handleShortBreakPress}>
              <Text color={activeTimer === 'Short Break' ? '$yellow400' : '$white'}>Short Break</Text>
            </TouchableOpacity>
          </Box>
          <Box h='100%' bg={activeTimer === 'Long Break' ? '$backgroundDark950' : 'transparent'} p='$2' borderRadius='$lg'>
            <TouchableOpacity onPress={handleLongBreakPress}>
              <Text color={activeTimer === 'Long Break' ? '$yellow400' : '$white'}>Long Break</Text>
            </TouchableOpacity>
          </Box>
        </HStack>
      </Center>
      <Box sx={{ flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Box sx={{ position: 'relative', width: circleSize, height: circleSize }}>
          <Svg width={circleSize} height={circleSize}>
            <Circle
              cx={circleSize / 2}
              cy={circleSize / 2}
              r={radius}
              stroke='#2D2D2D'
              opacity={50}
              fill='none'
              strokeDasharray={`${circumference} ${circumference}`}
              strokeWidth={30}
            />
              <AnimatedCircle
                cx={circleSize / 2}
                cy={circleSize / 2}
                r={radius}
                stroke='#facc15'
                fill='none'
                strokeDasharray={`${circumference} ${circumference}`}
                animatedProps={animatedProps}
                strokeWidth={15}
              />
            </Svg>
          <Center sx={{ position: 'absolute', top: 0, left: 0, width: circleSize, height: circleSize }}>
            <Text color='$white' size='6xl' fontWeight='bold'> {`${
              Math.floor(time / 60) < 10
              ? `0${Math.floor(time / 60)}`
              : `${Math.floor(time / 60)}`
            }:${time % 60 < 10 ? `0${time % 60}` : time % 60}`}</Text>
          </Center>
          </Box>
        </Box>
        <Box sx={{ mb: '$10', mr: '$2', ml: '$2'}}>
        <ListItem 
          item={{
            task_id: 1,
            title: 'Test',
            pomodoro_estimate: 1,
          }}
          isTimerScreen={true}
        />
        </Box>
        <Center mb='$10'>
          <HStack space='4xl' mb='$2.5'>
            <ButtonGroup space='2xl'>
            {
              timerStart ? 
              <Button
              size='xl'
              bg="$yellow400"
              borderColor="$yellow400"
              onPress={toggleTimer}
              width={150}
              >
                <ButtonText color='$backgroundDark900'>Pause</ButtonText>
              </Button>
              : 
              <Button
              size='xl'
              bg="$yellow400"
              borderColor="$yellow400"
              onPress={toggleTimer}
              width={150}
              >
                  <ButtonText color='$backgroundDark950'>Start</ButtonText>
                </Button>
            }
            <Button 
              size='xl' 
              variant='outline' 
              py='$2.5' 
              action='secondary'
              width={150}
              onPress={reset}
              borderColor='$yellow400'
              >
              <ButtonText color='$yellow400'>Skip</ButtonText>
            </Button>
          </ButtonGroup>
        </HStack>
      </Center>
    </Box>
  )
}

export default PomoTimer