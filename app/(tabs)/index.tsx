import { StyleSheet, Dimensions, View } from 'react-native';
import { Box, Center, Text } from '@gluestack-ui/themed';

import EditScreenInfo from '../../components/EditScreenInfo';
import HomeScreen from '../../components/home/HomeScreen';
import PagerView from 'react-native-pager-view';

export default function TabOneScreen() {
  return (
     <HomeScreen />
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
