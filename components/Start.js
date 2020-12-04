import React from 'react';
import { StyleSheet, View, Text, Button, ImageBackground, TouchableOpacity,KeyboardAvoidingView, Platform } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';

/**
 * @requires react
 * @requires react-native
 * @requires react-native-gesture-handler
 */

export default class Start extends React.Component {

    constructor(props){
        super(props);
        this.state={
            name:'',
            color: '',
        }
        
    }

render(){

    /**
     * Text input allows user to enter their name
     * Colored buttons allow user to choose background chat color
     */
    return(
        <ImageBackground source={require('../assets/BackgroundImage.png')} style={styles.background}>
            <Text style={styles.title}>Chat App</Text>
                <KeyboardAvoidingView behavior={Platform.OS === 'android' ? 'height' : 'padding'} style={styles.container}>
                    <TextInput
                        style={styles.namebox}
                        onChangeText={(name) => this.setState({name})}
                        value={this.state.text}
                        placeholder="Enter Your Name" textAlign='center'>
                    </TextInput>
                    <Text style={styles.text}>Choose Your Background Color:</Text>
                    <View style={styles.colorSelect}>
                    <TouchableOpacity style={[styles.color1, styles.colorButton]} onPress={() => this.setState({color: '#090C08'})}/>
                    <TouchableOpacity style={[styles.color2, styles.colorButton]} onPress={() => this.setState({color: '#474056'})}/>
                    <TouchableOpacity style={[styles.color3, styles.colorButton]} onPress={() => this.setState({color: '#8A95A5'})}/>
                    <TouchableOpacity style={[styles.color4, styles.colorButton]} onPress={() => this.setState({color: '#B9C6AE'})}/>
                    </View>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => this.props.navigation.navigate('Chat', {name: this.state.name, color: this.state.color})}>
                     <Text style={styles.startChat}>Start Chatting</Text>
                    </TouchableOpacity>
             
                </KeyboardAvoidingView>
        </ImageBackground>
        )
    }
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        alignItems: 'center',
        width: '100%',
        height: '100%',
    },
    container: {
        flex: 1, 
     //   justifyContent: 'center', 
        alignItems: 'center',
        height: '44%',
        width: '88%', 
        marginBottom: 20,
        backgroundColor: '#FFF',
    },
    colorButton: {
        height: 35,
        width: 35,
        borderRadius: 70,
        margin: 20
    },
    title: {
       flex: 1,
       alignItems: 'center',
       fontSize: 45,
       fontWeight: '600',
       color: '#FFFFFF',
       marginTop: 75, 
    },
    namebox: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000',
        borderWidth: 1,
        borderColor: 'grey',
        marginBottom: 30,
        marginTop: 15,
        width: '88%',
        height: '20%'
    },
    button: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFFFFF',
        backgroundColor: '#757083',
        marginBottom: 30,
        marginTop: 30,
        width: '88%',
        height: '20%'
    },
    text: {
        fontSize: 16,
        fontWeight: '300',
        color: '#757083',
        opacity: 100
    },
    colorSelect: {
        flex: 4,
        flexDirection: 'row',
        marginBottom: 50
    },
    color1: {
        backgroundColor: '#090c08'
    },
    color2: {
        backgroundColor: '#474056'
    },
    color3: {
        backgroundColor: '#8a95a5'
    },
    color4: {
        backgroundColor: '#b9c6ae'
    },

    startChat: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center',
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 20
    }
})