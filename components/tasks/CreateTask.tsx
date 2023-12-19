import { View, Text } from 'react-native'
import { Button, ButtonText } from '@gluestack-ui/themed'
import React from 'react'

type Props = {}

const CreateTask = (props: Props) => {
  return (
    <View>
      <Button 
        borderRadius='$full'
        size="lg"
        p="$3.5"
        bg="$indigo600"
        borderColor="$indigo600"
      >
          <ButtonText>Create</ButtonText>
        </Button>
    </View>
  )
}

export default CreateTask;