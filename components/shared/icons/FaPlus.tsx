import React from 'react'
import { FontAwesome } from '@expo/vector-icons'

type Props = {}

const FaPlus = (props: Props) => {
  return (
    <FontAwesome name='plus' size={25} {...props} />
  )
}

export default FaPlus