import React from 'react';
import { View, Text, Button, TouchableOpacity, StyleSheet, FlatList, LogBox } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { Bubble, GiftedChat, InputToolbar } from 'react-native-gifted-chat';
import NetInfo from '@react-native-community/netinfo';
import MapView from 'react-native-maps';
import CustomActions from './CustomActions';

// import firestore/firebase
const firebase = require('firebase');
require('firebase/firestore');

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
      
      
  //connect to firestore
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

  //Functions

  //Sends message from input bar  
  onSend(messages = []) {
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages),
        }),
          ()=> {
            this.addMessages();
            this.saveMessages();
          
              },
    )};

  /**
   * Updated the state based on firestore collection update
   * Will be called when the collection is updated
   * @function onCollectionUpdate
   * @param {string} _id
   * @param {string} text
   * @param {date} createdAt
   * @param {object} user
   * @param {string} image
   * @param {location} location
   */
      
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


   /**
    * Adds message to Firestore database
    * @function addMessages
    * @param {string} _id
    * @param {string} text
    * @param {date} createdAt
    * @param {object} user
    * @param {string} image
    * @param {location} location
    */   
  
   /**
    * 
    */

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

  /**
   * Saves messages to async storage
   * @async
   * @function saveMessages
   */

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

  /**
   * loads messages from async storage
   * @function getMessages
   * @async
   */

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

  /**
   * deletes messages from async storage
   * @function deleteMessages
   * @async
   */
      
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

  /**
   * GIFTED CHAT FUNCTIONS
   * @function renderBubble
   * @function renderInputToolbar
   * @function renderCustomActions
   * @function renderCustomView
   */
  
   
  //renders custom text bubbles 
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
  
  //renders no text chat input if user is offline
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

  //renders options to choose/take photo, send location
  renderCustomActions = (props) => {
    return <CustomActions {...props} />;
  };

  //renders map in chat of locations sent
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

  /**
* NetInfo checks if user is online and sets state appropriately
* firebase uses anonymous authentication
* subscribes authenticated user to firestore collection
* retrieves messages in firestore
  */
  
  //check to see if user is online
  NetInfo.fetch().then((state) => {
    if (state.isConnected) {
      //authorizes user anonymously
      this.authUnsubscribe = firebase.auth().onAuthStateChanged(async (user) => {
        if (!user) {
           try{
            await firebase.auth().signInAnonymously();
             } catch (error){
              console.log(`Unable to sign in: ${error.message}`)
             }
                   }
              //updates current user      
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
              //create a reference for the active users messages
              this.referenceMessageUser = firebase.firestore().collection('messages').where('user.uid', '==', this.state.uid).orderBy('createdAt', 'desc')
              //listen for changes in the collection of the current user
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
  //removes current user
  this.authUnsubscribe();
  //stop listening for changes
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
    />
  }
  </View>
     )
      }}

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
