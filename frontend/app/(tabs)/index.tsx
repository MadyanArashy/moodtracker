import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image, Keyboard, KeyboardAvoidingView, Platform, Pressable, SectionList, TextInput, View } from 'react-native';
import tw from 'twrnc';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { Environment } from '@/constants/Environment';
import { useColorScheme } from '@/hooks/useColorScheme';
import axios from 'axios';
import { format } from 'date-fns';
import { Dropdown } from 'react-native-element-dropdown';
import { SafeAreaView } from 'react-native-safe-area-context';

import AnimatedButton from '@/components/AnimatedButton';
import TaskComponent from '@/components/Task';
import DatePicker from 'react-native-date-picker';
import { Task, NewTask, Category } from '@/types/task';

export default function HomeScreen() {
  // API url dan warna untuk styling
  const API_URL = Environment.API_URL;
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  // Set array task items dan editing states
  const [taskItems, setTaskItems] = useState<Task[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [drawer, setDrawer] = useState(true);

  // Set states untuk setiap data
  const [isLoaded, setIsLoaded] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState(new Date());
  const [modalOpen, setModalOpen] = useState(false);
  const valid = (name?.trim().length > 0 && category?.trim().length > 0);

  // Array variabel dan state dropdown category
  const CATEGORIES = [
    {label: 'Senang', value: 'senang'},
    {label: 'Sedih', value: 'sedih'},
    {label: 'Stress', value: 'stress'},
  ]
  const [dropdown, setDropdown] = useState(false);

  // Filter kategori
  const [filter, setFilter] = useState<Category['name']>('');

  useEffect(() => {
    getTasks();
  },[]);

  const getTasks = async() => {
    try {
      const response = await axios.get(`${API_URL}/api/task`)
      setTaskItems(response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoaded(true);
    }
  };

  const handleAddTask = async () => {
    if (valid) {
      setRefreshing(true);
      Keyboard.dismiss();
      const formattedDate = format(date, 'yyyy-MM-dd');
      const newTask: NewTask = {
        name: name.trim(),
        category: category.trim(),
        date: formattedDate,
        status: false
      };
      clearInputs();
      try {
        await axios.post<Task>(`${API_URL}/api/task`, newTask);
        await getTasks();
        setRefreshing(false);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const filteredTasks = filter
  ? taskItems.filter(task => task.category === filter)
  : taskItems;

  // Pisahkan task sesuai date
  const groupedTasks = filteredTasks.reduce((groups, task) => {
    const date = format(new Date(task.date), 'EEEE, dd MMMM yyyy');
    if (!groups[date]) groups[date] = [];
    groups[date].push(task);
    return groups;
  }, {} as Record<string, Task[]>);

  // Konversi menjadi sections
  const sections = Object.keys(groupedTasks)
    .sort((a, b) => new Date(groupedTasks[a][0].date).getTime() - new Date(groupedTasks[b][0].date).getTime())
    .map(date => ({
      title: date,
      data: groupedTasks[date],
    }));


  const startEdit = (item:Task) => {
    setName(item.name);
    setCategory(item.category);
    setIsEditing(true);
    setEditId(item.id);
  }

  const handleEdit = async () => {
    if (editId === null || !valid) return;

    const formattedDate = format(date, 'yyyy-MM-dd');
    setRefreshing(true);
    try {
      await axios.put(`${API_URL}/api/task/${editId}`, {
        name: name.trim(),
        category: category.trim(),
        status: false,
        date: formattedDate,
      });
      cancelEdit();
      await getTasks();
    } catch (err) {
      console.error(err);
    } finally {
      setRefreshing(false);
    }
  };

  const clearInputs = () => {
    setName('');
    setCategory('');
    setDate(new Date);
  }

  const handleDelete = async(id:number) => {
    if(editId == id) {
      cancelEdit();
    }
    setRefreshing(true);
    try {
      await axios.delete(`${API_URL}/api/task/${id}`);
      await getTasks();
    } catch (error) {
      console.error(error)
    } finally {
      setRefreshing(false);
    }
  }

  const refreshFunction = async() => {
    setRefreshing(true);
    await getTasks();
    setRefreshing(false);
  }

  const cancelEdit = () => {
    setEditId(null);
    setIsEditing(false);
    clearInputs();
  }

  return (
    <ThemedView style={tw`flex-1`}>
      <SafeAreaView style={tw`flex-1`}>
        <View style={tw`w-full flex-row items-center justify-between mb-2 px-4`}>
          <Image source={require('@/assets/images/lifehub-horizontal-light.png')} style={tw`w-1/2 h-full`} resizeMode='cover'/>
          <AnimatedButton onPress={() => setDrawer(!drawer)} animationType='opacity'>
            <View style={[tw`p-1 rounded-lg`, {backgroundColor: colors.gray4}]}>
              { !drawer
                ?
                  <MaterialCommunityIcons name='menu' color={colors.icon} size={32}/>
                :
                  <MaterialCommunityIcons name='menu-open' color={colors.icon} size={32}/>
              }
            </View>
          </AnimatedButton>
        </View>
        {
        drawer ?
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={tw`w-full flex-col justify-around self-center mb-2 relative px-4`}
        >
          <View style={tw`w-full flex-col flex gap-2`}>
          <View style={tw`rounded-md`}>
            <TextInput
              style={[
                tw`px-4 py-2 border rounded-md`,
                {borderColor: colors.highlight, color: colors.text, backgroundColor: colors.gray2, fontSize: 16}
              ]}
              placeholderTextColor={colors.disabledText}
              placeholder="Write task"
              value={name || ''}
              onChangeText={(text) => setName(text)}
              multiline
            />
          </View>
          <View style={tw`rounded-md`}>
            <Dropdown
              data={CATEGORIES}
              labelField="label"
              valueField="value"
              onChange={item =>{
                setCategory(item.value);
              }}
              onFocus={() => setDropdown(true)}
              onBlur={() => setDropdown(false)}
              placeholder='Select a category'
              placeholderStyle={{ color: colors.disabledText }}
              selectedTextStyle={{ color: colors.text }}
              style={[tw`px-4 py-2 rounded-md border`, {
                backgroundColor: colors.gray2, borderColor: colors.highlight
              }, dropdown && {borderColor: colors.tint, borderWidth: 2, margin: -2}]}
              value={category || ''}
              renderItem={(item, selected) => (
                <View
                  style={[
                    tw`px-4 py-2`,
                    {
                      backgroundColor: selected ? colors.tint : colors.gray3,
                      borderBottomWidth: 1,
                      borderBottomColor: colors.highlight,
                    },
                  ]}
                >
                  <ThemedText>
                    {item.label}
                  </ThemedText>
                </View>
              )}
            />
          </View>
            <View
              style={[
                tw`rounded-md flex-row justify-between items-center gap-2`,
              ]}
            >
              <Pressable
                onPress={() => setModalOpen(true)}
                style={[
                  tw`px-4 py-2 border rounded-md flex-1`,
                  {borderColor: colors.highlight, backgroundColor: colors.gray2}
                ]}>
                <ThemedText style={tw`text-[${colors.text}]`}>
                  {format(date, 'EEEE, dd MMMM yyyy').toString()}
                </ThemedText>
              </Pressable>
              <DatePicker
                modal
                mode='date'
                open={modalOpen}
                date={date}
                onConfirm={(date) => {
                  setModalOpen(false)
                  setDate(date)
                }}
                onCancel={() => {
                  setModalOpen(false)
                }}
              />
            </View>
            <View style={tw`flex-col gap-1`}>
              <AnimatedButton onPress={isEditing ? handleEdit : handleAddTask} style={tw`align-middle justify-center`} disabled={!valid} animationType={'scale'}>
                <ThemedText
                  style={[
                    tw`text-center p-2 rounded-lg`,
                    {backgroundColor: valid ? colors.tint : colors.highlight, color: valid ? colors.text : colors.disabledText}
                  ]}>
                  {isEditing ? 'Edit' : 'Add'} Task
                </ThemedText>
              </AnimatedButton>
              <AnimatedButton animationType='opacity' onPress={() => cancelEdit()} style={{ backgroundColor: colors.gray1, borderColor: colors.highlight, padding: 4, width: 100, borderRadius: 4 }}>
                <ThemedText style={tw`text-center`}>
                  {isEditing ? 'Cancel edit' : 'Clear inputs'}
                </ThemedText>
              </AnimatedButton>
            </View>
          </View>
        </KeyboardAvoidingView>
        : ''}
        { isLoaded && !refreshing ?
          <>
            <ThemedText  style={tw`px-4 text-xl font-bold mb-2`}>
              Filter kategori:
            </ThemedText>
            <View style={tw`flex-row gap-2 mb-4 px-4`}>
              {['', 'senang', 'sedih', 'stress'].map((cat) => (
                <AnimatedButton
                  key={cat}
                  onPress={() => setFilter(cat as Category['name'])}
                  style={[
                    tw`px-4 py-2 rounded-xl`,
                    filter === cat ? {backgroundColor: colors.tint} : {backgroundColor: colors.gray2},
                  ]}
                >
                  <ThemedText>
                    {cat === '' ? 'Semua' : cat}
                  </ThemedText>
                </AnimatedButton>
              ))}
            </View>
            <SectionList
              sections={sections}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <TaskComponent
                  task={item}
                  editFunction={() => startEdit(item)}
                  deleteFunction={() => handleDelete(item.id)}
                />
              )}
              contentContainerStyle={tw`px-4 py-8`}
              refreshing={refreshing}
              onRefresh={() => refreshFunction()}
            />
          </>
          : <ActivityIndicator size={'large'} style={tw`flex-1`}/>
      }
      </SafeAreaView>
    </ThemedView>
  );
};
