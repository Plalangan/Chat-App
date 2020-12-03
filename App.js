import React from 'react';
import { StyleSheet, Text, View, TextInput, Alert, Button, ScrollView} from 'react-native';
import Start from './components/Start';
import Chat from './components/Chat';
import CustomActions from './components/CustomActions';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';



const Stack = createStackNavigator();

export default function App() {

  

  



  return (
    
  <NavigationContainer>
    <Stack.Navigator
      initialRouteName="Start">
      <Stack.Screen
        name="Start"
        component={Start}
        />
      <Stack.Screen
        name="Chat"
        component={Chat}
        />
 {/* <ScrollView style={{flex:1, justifyContent: 'center'}}>
    <TextInput
   style={{height: 40, borderColor: 'gray', borderWidth: 1}}
   onChangeText={(text) => this.setState({text})}
   value={this.state.text}
   placeholder='Type here...' 
   />
    <Button onPress={() => {
      this.alertMyText({text: this.state.text});
      }}
      title="Press Me"
    />
   <Text>You wrote: {this.state.text}</Text>
  </ScrollView>
    \*/}
  </Stack.Navigator>
  </NavigationContainer>
   
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row'
  },
  box1: {
    flex: 10,
    backgroundColor: 'blue'
  },
  box2: {
    flex: 120,
    backgroundColor: 'red'
  },
  box3: {
    flex: 50,
    backgroundColor: 'green'
  },
 });
