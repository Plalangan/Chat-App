import PropTypes from 'prop-types';
import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import MapView from 'react-native-maps';
import firebase from 'firebase';
import 'firebase/firestore';


/**
 * @requires react
 * @requires react-native
 * @requires prop-types
 * @requires firebase
 * @requires firebase/firestore
 * @requires expo-permissions
 * @requires expo-image-picker
 * @requires expo-location
 * @requires react-native-maps
 */

export default class CustomActions extends React.Component {

  constructor(props){
    super(props);

      this.state = {
        location: null
      }
  }


  //Functions

  /**
   * Opens action sheet when button is pressed
   * @function onActionPress
   */

  onActionPress = () => {
      const options = ['Choose From Library', 'Take Picture', 'Send Location', 'Cancel'];
      const cancelButtonIndex = options.length - 1;
      this.context.actionSheet().showActionSheetWithOptions(
        {
          options,
          cancelButtonIndex,
        },
        async (buttonIndex) => {
          switch (buttonIndex) {
            case 0:
                this.pickImage();
                return;
            case 1:
                this.takePhoto();
                return;
            case 2:
                this.getLocation();
                default:
            }
          },
        );
      };

    /**
     * lets a user pick an image from their library, asks for permission first
     * @function pickImage
     */
    
    pickImage = async () => {
      try{
      const {status} = await Permissions.askAsync(Permissions.CAMERA_ROLL);    
        if(status === 'granted'){
          let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
          }).catch(error => console.log(error));
    
          if (!result.cancelled){
            const imageUrl = await this.uploadImage(result.uri);
            this.props.onSend({ image: imageUrl})
          }
        }
      } catch (error){
        console.log(error.message)
      }
    }

    /**
     * lets user send their current location
     * @function getLocation
     */

    getLocation = async () => {
      try{
        const { status } = await Permissions.askAsync(Permissions.LOCATION);

        if(status === 'granted'){
          let result = await Location.getCurrentPositionAsync({}).catch(error => console.log(error));
          const longitude = JSON.stringify(result.coords.longitude);
          const latitude = JSON.stringify(result.coords.latitude);
        if(result) {
          this.props.onSend({
            location:{
              longitude: result.coords.longitude,
              latitude: result.coords.latitude,
            }
         })
       }
     }
    } catch(error){
    console.log(error)
    }
    }

    /**
     * lets user open up camera to take a picture to send, asks for permission first
     * @function takePhoto
     */

    takePhoto = async () => {
      try{
        const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL, Permissions.CAMERA);
          if(status === 'granted'){
            let result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images
            }).catch(error => console.log(error));
          if (!result.cancelled){
            const imageUrl = await this.uploadImage(result.uri);
            this.props.onSend({ image: imageUrl})
         }
        }
      } catch(error){
        console.log(error.message)
      }
   }

    /**
     * uploades image sent to the firestore database
     * @function uploadImage
     */

    uploadImage = async (uri) => {
      try {
        const blob = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = () => {
          resolve(xhr.response);
        };
        xhr.onerror = (error) => {
          console.error(error);
          reject(new TypeError('Network Request Failed!'));
        };
        xhr.responseType = 'blob';
        xhr.open('GET', uri, true);
        xhr.send(null);
      });
      const getImageName = uri.split('/');
      const imageArrayLength = getImageName[getImageName.length - 1];
      const ref = firebase
        .storage()
        .ref()
        .child(`images/${imageArrayLength}`);

      const snapshot = await ref.put(blob);
      blob.close();
      const imageURL = await snapshot.ref.getDownloadURL();
      return imageURL;
    } catch (error) {
      console.log(error.message);
    }
    }


  render(){

    /**
     * Touchable opacity brings up action sheet
     */
    return(
      <View>
        <TouchableOpacity 
          style={[styles.container]} 
          onPress={this.onActionPress}>
        <View style={[styles.wrapper, this.props.wrapperStyle]}>
        <Text style={[styles.iconText, this.props.iconTextStyle]}>+</Text>
      </View>
        </TouchableOpacity>
          {this.state.location &&
          <MapView
            style={{width: 375, height: 700}}
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
    container: {
      width: 26,
      height: 26,
      marginLeft: 10,
      marginBottom: 10,
    },
    wrapper: {
      borderRadius: 13,
      borderColor: '#b2b2b2',
      borderWidth: 2,
      flex: 1,
    },
    iconText: {
      color: '#b2b2b2',
      fontWeight: 'bold',
      fontSize: 16,
      backgroundColor: 'transparent',
      textAlign: 'center',
    },
   });

   CustomActions.contextTypes = {
    actionSheet: PropTypes.func,
   };