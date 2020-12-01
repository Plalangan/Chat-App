import React from 'react';
import { View, Text, Button, TouchableOpacity, StyleSheet } from 'react-native';



export default class Chat extends React.Component {
    constructor(props){
        super(props)
    }

    render(){
        let name = this.props.route.params.name;
        let color = this.props.route.params.color;

        this.props.navigation.setOptions({ title: name });
        return(
            
            <View style={{flex: 1, backgroundColor: color}}>
            <Text style={styles.chat}>Hello {name}!</Text>
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
