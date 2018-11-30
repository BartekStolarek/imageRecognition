import React from 'react';
import { Text, View, TouchableOpacity, StyleSheet } from 'react-native';
import { Camera, Permissions } from 'expo';
import TabBarIcon from '../components/TabBarIcon';;

export default class HomeScreen extends React.Component {
    static navigationOptions = {
    title: 'Camera'
  };

  state = {
    hasCameraPermission: null,
    type: Camera.Constants.Type.back,
    focusedScreen: null
  };

  componentDidMount() {
    this._askForPermissions();

    const { navigation } = this.props;
    navigation.addListener('willFocus', () =>
      this.setState({ focusedScreen: true })
    );
    navigation.addListener('willBlur', () =>
      this.setState({ focusedScreen: false })
    );
  }

  async _askForPermissions() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === 'granted' });
  }

  _flipCamera() {
    console.log('Flip camera');
    this.setState({
      type: this.state.type === Camera.Constants.Type.back
        ? Camera.Constants.Type.front
        : Camera.Constants.Type.back,
    });
  }

  _takePhoto() {
    if (this.camera) {
      this.camera.takePictureAsync().then((photo) => {
        this.props.navigation.navigate('Photo', { photo: photo });
      });
    }
  }

  render() {
    const { hasCameraPermission, focusedScreen } = this.state;
    if (hasCameraPermission === null) {
      return <View />;
    } else if (hasCameraPermission === false) {
      return <Text>No access to camera.</Text>;
    } else if (focusedScreen) {
      return (
        <View style={styles.container}>
          <Camera style={styles.camera} type={this.state.type} ref={ref => { this.camera = ref; }}>
            <View style={styles.cameraWrapper}>
              <TouchableOpacity style={styles.flipWrapper} onPress={() => { this._flipCamera(); }}>
                <TabBarIcon name={'ios-reverse-camera'} />
                <Text style={styles.flipText}>Flip</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.snapWrapper} onPress={() => { this._takePhoto(); }}>
                <TabBarIcon name={'ios-radio-button-on'} size={80}/>
              </TouchableOpacity>
            </View>
          </Camera>
        </View>
      );
    } else {
      return <View />;
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  camera: {
    flex: 1
  },
  cameraWrapper: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'column',
    flexWrap: 'wrap'
  },
  flipWrapper: {
    flex: 1,
    alignItems: 'flex-end',
    paddingRight: 10,
    paddingTop: 10 
  },
  flipText: {
    fontSize: 14,  
    color: 'white'
  },
  snapWrapper: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 25
  }
});