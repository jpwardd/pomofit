import { Box, Button, ButtonText, Center, HStack, Heading, Text, Progress, VStack, ButtonIcon, ButtonGroup, styled, Pressable } from '@gluestack-ui/themed';
import { AppState, AppStateStatus, Dimensions } from 'react-native';
import React, { useState, useRef, useEffect } from 'react'
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { differenceInSeconds } from "date-fns";
// import { AnimatedSvg, AnimatedCircle } from '@gluestack-style/animation-resolver';
import Svg, { Circle } from 'react-native-svg';
import Animated, { useAnimatedProps } from 'react-native-reanimated';

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
  const [time, setTime] = useState(1500);
  const [timerStart, setTimerStart] = useState(false);
  const [initialStartTime, setInitialStartTime] = useState(0);
  // Storage when app is in background
  const appState = useRef(AppState.currentState);
  const [elapsed, setElapsed] = useState(0);

  const animatedProps = useAnimatedProps(() => {
    const strokeDashoffset = (circumference * time) / 1500 - circumference;
    return {
      strokeDashoffset,
    };
  });

  const toggleTimer = () => {
    if (!timerStart) {
      recordStartTime();
    }

    setTimerStart(!timerStart);
  };

  const reset = () => {
    setTime(1500);
    setTimerStart(false);
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

  const handleAppStateChange = async (nextAppState: AppStateStatus) => {
    if (appState.current.match(/inactive|background/) &&
      nextAppState === "active") {
      // We just became active again: recalculate elapsed time based 
      // on what we stored in AsyncStorage when we started.
      const elapsedTime = await getElapsedTime();
      // Update the elapsed seconds state
      setElapsed(elapsedTime || 0);
    }
    appState.current = nextAppState;
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
    const interval = setInterval(() => {
      if (timerStart) {
        if (time > 0) {
          setTime(time - 1);
        } else if (time === 0) {
          // TODO: Send notification to user.
          clearInterval(interval);
        }
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [timerStart, time]);
  
  return (
    <Box sx={{ bg: '$backgroundDark900', w: '100%', h: '100%'}}>
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
              // strokeDashoffset={circumference - (circumference * elapsed) / time}
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
                rotation={-90}
                origin={`${circleSize / 2}, ${circleSize / 2}`} 
              />
            </Svg>
          <Center sx={{ position: 'absolute', top: 0, left: 0, width: circleSize, height: circleSize }}>
            <Text color='white' size='6xl' fontWeight='bold'> {`${
              Math.floor(time / 60) < 10
              ? `0${Math.floor(time / 60)}`
              : `${Math.floor(time / 60)}`
            }:${time % 60 < 10 ? `0${time % 60}` : time % 60}`}</Text>
          </Center>
          </Box>
            </Box>
        <Center mb='$4'>
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
                  <ButtonText color='$backgroundDark'>Play</ButtonText>
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
              <ButtonText color='$yellow400'>Reset</ButtonText>
            </Button>
          </ButtonGroup>
        </HStack>
      </Center>
    </Box>
  )
}

export default PomoTimer