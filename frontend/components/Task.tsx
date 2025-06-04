import React, {useState} from 'react';
import { Text, View, Image, StyleProp } from 'react-native';
import tw from 'twrnc';

import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import AnimatedButton from './AnimatedButton';
import { format } from 'date-fns';
import { AntDesign, Entypo } from '@expo/vector-icons';
import { Environment } from '@/constants/Environment';
import axios from 'axios';
import Tooltip from './Tooltip';
import { Task } from '@/types/task';

type Props = {
  task: Task,
  editFunction: () => void,
  deleteFunction: () => void,
  style?: StyleProp<View>
}

const TaskComponent = ({task, editFunction, deleteFunction}: Props) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [checked, setChecked] = useState(task.status);
  const [tooltip, setTooltip] = useState(false);

  const categoryColors = {
    light: {
      sedih: '#7C00FE',
      senang: '#F5004F',
      stress: '#73EC8B',
      default: colors.text
    }, dark: {
      sedih: '#c869ff',
      senang: '#ff4766',
      stress: '#95fc97',
      default: colors.text

    }
  };
  const currentColor = categoryColors[colorScheme ?? 'light']
    let selectedColor = currentColor.default
    switch (task.category) {
    case 'senang':
      selectedColor = currentColor.senang;break;
    case 'sedih':
      selectedColor = currentColor.sedih;break;
    case 'stress':
      selectedColor = currentColor.stress;break;
    default:
      selectedColor = currentColor.default;break;
  }
  
  

  const API_URL = Environment.API_URL;

  const handleCheck = async () => {
    const nextChecked = !checked;
    setChecked(nextChecked);
    try {
      await axios.patch(`${API_URL}/api/task/${task.id}`, { status: nextChecked });
    } catch (error) {
      console.error(error);
      setChecked(checked);
    }
  };

  return (
    <View style={tw`relative`}>
      <AnimatedButton
        animationType="color"
        activeColor={colors.highlight}
        inactiveColor={colors.gray1}
        style={tw`flex-col shadow mb-2 rounded-lg`}
        onPress={() => {setTooltip(false);handleCheck()}}
        onLongPress={() => setTooltip(true)}
      >
        <View style={tw`flex-row items-center gap-2 w-full px-4 py-2`}>
          <View style={[tw`w-6 h-6`, { backgroundColor: colors.background }]}>
            {checked ? <AntDesign name="check" size={24} color={colors.tint} /> : null}
          </View>
          <View style={tw`flex-col w-full`}>
            <View style={tw`flex-row gap-2 items-center`}>
              <Text style={{ color: selectedColor, fontSize: 12, fontWeight: '600', textTransform: 'capitalize' }}>
                {task.category}
              </Text>
              <ThemedText>•</ThemedText>
              <ThemedText style={{ fontSize: 12 }}>
                {format(task.date, 'EEEE, dd MMMM yyyy')}
              </ThemedText>
            </View>
            <ThemedText>{task.name}</ThemedText>
          </View>
        </View>
      </AnimatedButton>

      {tooltip && (
        <Tooltip
          visible={tooltip}
          editFunction={() => (editFunction(), setTooltip(false))}
          deleteFunction={() => {deleteFunction(), setTooltip(false)}}
          close={() => setTooltip(false)}
        />
      )}
    </View>

  );
};

export default TaskComponent;
