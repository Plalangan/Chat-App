import React from 'react';
import { View, Text, Button, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { Bubble, GiftedChat } from 'react-native-gifted-chat';
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
            uid: 1
        }

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
          var data = doc.data();
          messages.push({
            _id: data._id,
            createdAt: data.createdAt.toDate(),
            user: data.user,
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

    componentDidMount() {
        this.setState({
          messages: [
            
            {
              _id: 2,
              text: 'This is a system message',
              createdAt: new Date(),
              system: true
            }
          ],
        });
       

        this.referenceMessages = firebase.firestore().collection('messages');
        //this.unsubscribe = this.referenceShoppingLists.onSnapshot(this.onCollectionUpdate)

        this.authUnsubscribe = firebase.auth().onAuthStateChanged(async (user) => {
          if (!user) {
            await firebase.auth().signInAnonymously();
          }
        
          //update user state with currently active user data
          this.setState({
            uid: user.uid,
            loggedInText: 'Hello there',
          });

          this.referenceMessagesUser = firebase.firestore().collection('messages').where("user.uid", "==", this.state.uid);
          this.unsubscribeChatUser = this.referenceMessagesUser.onSnapshot(this.onCollectionUpdate);
        });
      }

    componentWillUnmount(){
     // this.unsubscribeListUser();
      this.authUnsubscribe();
      //this.unsubscribeChatUser();
    }

    render(){
        let name = this.props.route.params.name;
        let color = this.props.route.params.color;

        //this.props.navigation.setOptions({ title: name });

        
        return(
         
        
        /*<FlatList
          data={this.state.messages}
          renderItem={({ text}) =>
        <Text>{item.name}: {item.items} </Text>} />
        */

           <View style={{flex: 1, backgroundColor: color}}>
            <GiftedChat
            renderBubble={this.renderBubble.bind(this)}
            messages={this.state.messages}
            onSend={messages => this.onSend(messages)}
            image={this.state.image}
            user={{
            uid: this.state.uid,
            }}
            />
            
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
