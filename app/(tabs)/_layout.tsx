import FontAwesome from '@expo/vector-icons/FontAwesome';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Link, Tabs, useNavigation } from 'expo-router';
import { Platform, Pressable, useColorScheme } from 'react-native';
import Colors from '../../constants/Colors';
import { Feather } from '@expo/vector-icons';
import { Fab, FabLabel, useToken, FabIcon, Box } from "@gluestack-ui/themed"
import CreateTask from '../../components/tasks/CreateTask';
import { useEffect } from 'react';

/**
 * You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
 */
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

const PlusIcon = (props: any) => (
  <FontAwesome name='plus' size={25} {...props} />
);

const AddTaskIcon = (props: any) => (
  <MaterialIcons name='add-task' {...props} />
);

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const backgroundColor = useToken('colors', 'backgroundDark900');
  const yellow400 = useToken('colors', 'yellow400');

  const navigation = useNavigation();

  return (
    <>
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: yellow400,
        tabBarStyle: {
          backgroundColor: backgroundColor,
        },
        headerShown: false,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />,
          headerShown: true,
          headerRight: () => (
            <Link href="/modal" asChild>
              <Pressable>
                {({ pressed }) => (
                  <FontAwesome
                    name="info-circle"
                    size={25}
                    color={Colors[colorScheme ?? 'light'].text}
                    style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                  />
                )}
              </Pressable>
            </Link>
          ),
        }}
      />
      <Tabs.Screen 
        name='timer' 
        options={{ 
          title: '',
          tabBarIcon: ({ color }) => <MaterialIcons name='timer' size={28} style={{ marginBottom: -3 }} color={color} />,
        }} 
      />
      <Tabs.Screen
        name="tasks/create"
        options={{
          title: '',
          tabBarIcon: ({ color }) =>  { 
            <PlusIcon color={backgroundColor} />
            return (
              <Box 
                width={Platform.OS === 'ios' ? 60 : 60}
                height={Platform.OS === 'ios' ? 60 : 60}
                borderRadius='$full'
                bg='$yellow400'
                alignItems='center'
                justifyContent='center'
                borderColor='$backgroundDark900'
                borderWidth={Platform.OS === 'ios' ? 5 : 0}
              >

              </Box>
          )},
        }}
      />
      <Tabs.Screen
        name="two"
        options={{
          title: 'Tab Two',
          tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />,
        }}
      />
      <Tabs.Screen
        name="four"
        options={{
          title: 'Tab 5',
          tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />,
        }}
      />
    </Tabs>
    </>
  );
}
