import React from 'react';
import { View, Text, Button, TouchableOpacity, StyleSheet } from 'react-native';
import { Bubble, GiftedChat } from 'react-native-gifted-chat';


export default class Chat extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            messages: []
        }

      
    }

    onSend(messages = []) {
        this.setState(previousState => ({
          messages: GiftedChat.append(previousState.messages, messages),
        }))
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

    componentDidMount() {
        this.setState({
          messages: [
            {
              _id: 1,
              text: 'Hello Developer',
              createdAt: new Date(),
              user: {
                _id: 2,
                name: 'React Native',
                avatar: 'https://placeimg.com/140/140/any',
              },
            },
            {
              _id: 2,
              text: 'This is a system message',
              createdAt: new Date(),
              system: true
            }
          ],
        })
      }

    render(){
        let name = this.props.route.params.name;
        let color = this.props.route.params.color;

        //this.props.navigation.setOptions({ title: name });

        
        return(
            
            <View style={{flex: 1, backgroundColor: color}}>
            <GiftedChat
            renderBubble={this.renderBubble.bind(this)}
            messages={this.state.messages}
            onSend={messages => this.onSend(messages)}
            user={{
            _id: 1,
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
