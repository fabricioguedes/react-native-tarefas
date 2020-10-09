import React,{useState,useCallback, useEffect} from 'react';
import { StyleSheet, Text, View,SafeAreaView,StatusBar ,TouchableOpacity,FlatList,Modal, TextInput,AsyncStorage} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';

// set animation
const AnimateBtn=Animatable.createAnimatableComponent(TouchableOpacity);

import TaskList from './src/components/TaskList';

export default function App() {

  // modal false / true
  const [open,setOpen] = React.useState(false);
  // form input task
  const [input,setInput] = React.useState('');

  const [task,setTask]= React.useState([]);


  // list tasks
  useEffect(() => {
    // Create an scoped async function in the hook
    async function loadTasks() {
      const taskStorage= await AsyncStorage.getItem('@task');
      if (taskStorage) {
        setTask(JSON.parse(taskStorage));
      } 

    }
    // Execute the created function directly
    loadTasks();
  }, []);

  // salve tasks
  useEffect(() => {
    // Create an scoped async function in the hook
    async function saveTasks() {
      await AsyncStorage.setItem('@task',JSON.stringify(task))

    }
    // Execute the created function directly
    saveTasks();
  }, [task]);

  // submit
  function handleSubmit(){

    if (input==='')return;

    const data={
        key:input,
        task:input
    }

    setTask([...task,data])
    setOpen(false);
    setInput('');

  }
  // delete task
  const handleDelete=useCallback(
    (data) =>{
      const find=task.filter(r=>r.key !==data.key);
      setTask(find)
    }
)
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#171d31" barStyle="light-content"></StatusBar>

       <View style={styles.content}>
         <Text style={styles.title} >Minhas Tarefas </Text>
       </View>

       <FlatList
          marginHorizontal={10}
          showsHorizontalScrollIndicator={false}
          data={task}
          keyExtractor={
            (item)=> String(item.key)
          }
          renderItem={
            ({item})=> <TaskList data={item} handleDelete={handleDelete}/>
          }  
        > 
       </FlatList>
      {/* Modal */}
       <Modal  animationType="slide" transparent={false} visible={open} >
          <SafeAreaView style={styles.modal}>
              <View style={styles.modalHeader}>
                    <TouchableOpacity 
                        onPress={
                          ()=>setOpen(false)
                        }
                        >
                          <Ionicons  style={{marginLeft:5,marginRight:5}}name="md-arrow-back" size={40}   color="#FFFFFF" /> 
                    </TouchableOpacity>

                    <Text style={styles.modalTitle}>Nova Tarefa</Text>
              </View>
              <Animatable.View style={styles.modalBody} animation="fadeInUp" useNativeDriver>
                       <TextInput
                         multiline={true}
                         placeholderTextColor="#747474"
                         autoCorrect={false}
                         placeholder="O que precisa fazer hoje?"
                         style={styles.input}
                         value={input}
                         onChangeText={
                           (text)=>setInput(text) 
                         }
                       
                       /> 
                      <TouchableOpacity style={styles.handleAdd} onPress={handleSubmit}>
                          <Text style={styles.handleAddtext}>Cadastrar</Text>
                      </TouchableOpacity>
              </Animatable.View>
            </SafeAreaView>
       </Modal>
       <AnimateBtn 
        style={styles.fab}
        useNativeDriver
        animation="bounceInUp"
        duration={1500}
        onPress={
          ()=>setOpen(true)
        }
       >
         <Ionicons name="ios-add"  size={35} color="#fff"></Ionicons>
       </AnimateBtn>

    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#171d31',
    // alignItems: 'center',
    // justifyContent: 'center',
  },
  content: {

  },
  modal:{
    flex:1,
    backgroundColor: '#171d31',

  },
  modalHeader:{
    marginLeft:10,
    marginTop:20,
    flexDirection:'row',
    alignItems:'center'
  },
   modalTitle:{
    marginLeft:15,
    marginLeft:15,
    fontSize:25,
    color:'#FFFFFF'

  },
  modalBody:{
    marginTop:15

  },
  input:{
    fontSize:15,
    marginLeft:20,
    marginRight:20,
    backgroundColor:'#ffffff',
    height:85,
    padding:9,
    textAlignVertical:'top',
    borderRadius:5
    
  },
  handleAdd:{
    backgroundColor:'#fff',
    marginTop:10,
    alignItems:'center',
    justifyContent:'center',
    marginLeft:20,
    marginRight:20,
    height:40,
    borderRadius:5

  },
  handleAddtext:{
    fontSize:20,
    color:'#000000'
  },

  title: {
    fontSize: 25,
    color: '#FFFFFF',
    textAlign:"center",
    marginTop:60
  },
  fab: {
   position:'absolute',
   width:60,
   height:60,
   backgroundColor:'#0094FF',
   alignItems:'center',
   justifyContent:'center',
   borderRadius:30,
   right:25,
   bottom:25,
   elevation:2,
   zIndex:9,
   shadowColor:'#000',
   shadowOffset:{
     width:1,
     height:3,
   }

  },
});
