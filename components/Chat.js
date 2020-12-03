import React from 'react';
import { View, Text, Button, TouchableOpacity, StyleSheet, FlatList, LogBox } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { Bubble, GiftedChat, InputToolbar } from 'react-native-gifted-chat';
import NetInfo from '@react-native-community/netinfo';
const firebase = require('firebase');
require('firebase/firestore');
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import MapView from 'react-native-maps';
import CustomActions from './CustomActions';



export default class Chat extends React.Component {
    constructor(){
        super()
        this.state = {
            messages: [],
            user: {
              _id: '',
              name: '',
              avatar: ''
            },
            image: null,
            location: null,
            loggedInText: '',
            uid: 1,
            isConnected: false,
        }

      LogBox.ignoreAllLogs()

      const firebaseConfig = {
        apiKey: "AIzaSyBbHXvY-YPrjcO0uT8Hxrp619XZ78w8Nx4",
        authDomain: "chat-app-c3076.firebaseapp.com",
        databaseURL: "https://chat-app-c3076.firebaseio.com",
        projectId: "chat-app-c3076",
        storageBucket: "chat-app-c3076.appspot.com",
        messagingSenderId: "429302606837",
        appId: "1:429302606837:web:51c2d9bdcc23e025340ebc",
        measurementId: "G-B8624QN2YM"
        }
      
      if (!firebase.apps.length){
        firebase.initializeApp(firebaseConfig);
        }

        this.referenceMessages = firebase.firestore().collection('messages');
    }

    onSend(messages = []) {
        this.setState(previousState => ({
          messages: GiftedChat.append(previousState.messages, messages),
        }),
        ()=> {
          this.addMessages();
          this.saveMessages();
          
        },
        )};
      
    onCollectionUpdate = (querySnapshot) => {
        const messages = [];
        // go through each document
        querySnapshot.forEach((doc) => {
          // get the QueryDocumentSnapshot's data
          let data = doc.data();
          messages.push({
            _id: data._id,
            createdAt: data.createdAt.toDate(),
            user: {
              _id: data.user._id,
              name: data.user.name,
              avatar: data.user.avatar

            },
            text: data.text,
            location: data.location || null,
            image: data.image || ''
            });
        });
        this.setState({
          messages
        });
      };

      addMessages = () => {
        const message = this.state.messages[0];
        this.referenceMessages.add({
          _id: message._id,
          text: message.text || '',
          createdAt: message.createdAt,
          user: message.user,
          image: message.image || '',
          location: message.location || null
        });
      };

      saveMessages = async () => {
        try {
          await AsyncStorage.setItem(
            'messages',
            JSON.stringify(this.state.messages),
          );
        } catch (error) {
          console.log(error.message);
        }
      };

      async getMessages() {
        let messages = '';
        try {
          messages = await AsyncStorage.getItem('messages') || [];
          this.setState({
            messages: JSON.parse(messages)
          });
        } catch (error) {
          console.log(error.message);
        }
      };
      
      async deleteMessages() {
        try {
          await AsyncStorage.removeItem('messages');
          this.setState({
            messages: []
          })
        } catch (error) {
          console.log(error.message);
        }
      }



    renderBubble(props) {
        return (
            <Bubble
            {...props}
            wrapperStyle={{
                left: {
                    backgroundColor: '#0788EB',
                    },
                right: {
                    backgroundColor: '#000'
                    }, 
            }}
            />
        )
    }

    renderInputToolbar(props) {
      if (this.state.isConnected === false) {
      } else {
        return(
          <InputToolbar
          {...props}
        
          />
        );
      }
    }


    renderCustomActions = (props) => {
      return <CustomActions {...props} />;
    };

    renderCustomView (props) {
      const { currentMessage} = props;
      if (currentMessage.location) {
        return (
            <MapView
              style={{width: 150,
                height: 100,
                borderRadius: 13,
                margin: 3}}
              region={{
                latitude: currentMessage.location.latitude,
                longitude: currentMessage.location.longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              }}
            />
        );
      }
      return null;
    }

    componentDidMount() {
      NetInfo.fetch().then((state) => {
        if (state.isConnected) {
          this.authUnsubscribe = firebase.auth().onAuthStateChanged(async (user) => {
            if (!user) {
              try{
              await firebase.auth().signInAnonymously();
              } catch (error){
                console.log(`Unable to sign in: ${error.message}`)
              }
            }
              this.setState({
                isConnected: true,
                user: {
                  _id: user.uid,
                  name: this.props.route.params.name,
                  avatar: "https://placeimg.com/140/140/any",
                },
                loggedInText: `${this.props.route.params.name} has entered the chat`,
                messages: [],
              });
              this.referenceMessageUser = firebase.firestore().collection('messages').where('user.uid', '==', this.state.uid).orderBy('createdAt', 'desc')
              this.unsubscribeChatUser = this.referenceMessageUser.onSnapshot(this.onCollectionUpdate);
      
                
            });
        } else {
          this.setState({
            isConnected: false,
          });
          this.getMessages();
        }
      });
    }



    componentWillUnmount(){

      this.authUnsubscribe();
      this.unsubscribeChatUser();
    }

    render(){
        let name = this.props.route.params.name;
        let color = this.props.route.params.color;


        
        return(
         
     

           <View style={{flex: 1, backgroundColor: color}}>
            <GiftedChat
            renderBubble={this.renderBubble.bind(this)}
            renderActions={this.renderCustomActions.bind(this)}
            renderInputToolbar={this.renderInputToolbar.bind(this)}
            renderCustomView={this.renderCustomView}
            messages={this.state.messages}
            onSend={messages => this.onSend(messages)}
            image={this.state.image}
            avatar={this.state.user.avatar}
            user={{
            uid: this.state.uid,
            }}
            />
       
            
            {this.state.location &&
            <MapView
            style={{width: '100%', height: 200}}
            region={{
            latitude: this.state.location.coords.latitude,
            longitude: this.state.location.coords.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
/>}

            </View>
          
        )
    }
}

const styles = StyleSheet.create({
    chat: {
        flex: 1,
        textAlign: 'center',
        alignItems: 'center',
        fontSize: 35,
        color: '#FFF',
        marginTop: 100
    }
})
