import { StyleSheet, Dimensions } from 'react-native';

import EditScreenInfo from '../../components/EditScreenInfo';
import { Text, View } from '../../components/Themed';
import { AnimatedCircle } from '@gluestack-style/animation-resolver';

const { width } = Dimensions.get('window');
const circleSize = width - 32;
const strokeWidth = 50;
const radius = (circleSize - strokeWidth) / 2;
const circumference = radius * 2 * Math.PI;


export default function TabOneScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tab One</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <EditScreenInfo path="app/(tabs)/index.tsx" />
      <AnimatedCircle
            cx={circleSize / 2}
            cy={circleSize / 2}
            r={radius}
            stroke='red'
            fill='none'
            strokeDasharray={`${circumference} ${circumference}`}
            // strokeDashoffset={circumference - (circumference * elapsed) / time}
            strokeWidth={strokeWidth}
            animationComponentGluestack={true}
          />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
