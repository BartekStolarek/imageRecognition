import React from 'react';
import { Text, Button, View, StyleSheet, ActivityIndicator, Dimensions, ImageBackground, TouchableOpacity, CameraRoll } from 'react-native';
import { Permissions } from 'expo';
import TabBarIcon from '../components/TabBarIcon';

export default class PhotoScreen extends React.Component {

constructor(props) {
    super(props);

    this.state = {
        uri: this.props.navigation.state.params.photo.uri,
        height: this.props.navigation.state.params.photo.height,
        width: this.props.navigation.state.params.photo.width,
        hasCameraRollPermission: null,
        imageAnalysis: [],
        uploadingError: null,
        savePhotoState: null,
        savedUri: null
    };
}

async componentWillMount() {
    this._requestPhotoAnalysis();
}

async _askForPermissions() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    this.setState({ hasCameraRollPermission: status === 'granted' });
}

_cancelPhoto() {
    this.props.navigation.navigate('Main');
}

_savePhoto() {
    this._askForPermissions().then(
        (response) => {
            CameraRoll.saveToCameraRoll(this.state.uri).then(
                (response) => {
                    this.setState({ savedUri: response })
                    this.setState({ savePhotoState: 'saved' });
                }, (err) => {
                    console.log(err);
                    this.setState({ savePhotoState: 'failed' });
                }
            );
        }
    )
}

_requestPhotoAnalysis() {
    this.setState({ uploadingError: false });

    const apiKey = "{yourApiKeyHere}";
    const body = new FormData
    body.append("file", {
        uri: this.state.uri,
        type: 'image/jpeg',
        name: 'testPhotoName'
    })
    body.append("api_key", apiKey)
    
    fetch("https://apis.paralleldots.com/v3/object_recognizer", {
    body,
    headers: {
        Accept: "application/json",
        "Content-Type": "multipart/form-data"
    },
    method: "POST"
    }).then(
        (response) => {
            response.json().then((data) => {
                if (data.output) {
                    this.setState({ imageAnalysis: data.output });
                } else {
                    this.setState({ uploadingError: true });
                }
            });
        }, (err) => {
            console.log(err);
        }
    )
}

_calculateWidth(number) {
    let width = Dimensions.get('window').width;
    return width*number;
}

_renderResults() {
    if (this.state.imageAnalysis.length > 0) {
        return this.state.imageAnalysis.map((item, key) => {
            if (key < 6) {
                return(
                    <View style={styles.analysisElementRow} key={key}> 
                        <Text style={styles.resultText}>{item.tag} {Math.floor(item.score * 100)}% </Text>
                        <View style={[styles.progress, { width: this._calculateWidth(item.score) }]}></View>
                    </View>
                );
            }
        });
    } else if (this.state.uploadingError === true) {
        return(
            <View style={styles.processingText}>
                <Text style={{ marginBottom: 20 }}>Error while uploading photo. Make sure that you have the Internet connection available.</Text>
                <Button 
                    onPress={() => { this._requestPhotoAnalysis() }} 
                    color="#cccccc"
                    title="Click here to try again" />
            </View>
        );
    } else {
        return(
            <View style={styles.processingText}>
                <ActivityIndicator size="large" color="#4286f4" />
                <Text>Processing...</Text>
            </View>
        );
    }
}

render() {
    return (
    <View style={styles.container}>
        <ImageBackground source={{uri: this.state.uri}} style={styles.backgroundImage}>
            <View style={styles.topView}>
            </View>
            <View style={styles.bottomView}>
                <View style={styles.results}>
                    { this._renderResults() }
                </View>
                <View style={styles.buttons}>
                    <TouchableOpacity style={styles.button} onPress={() => { this._cancelPhoto() }}>
                        <TabBarIcon name={'ios-close-circle'} />
                        <Text style={styles.textButton}>Cancel</Text>
                    </TouchableOpacity>
                    
                    { this.state.savePhotoState === null ?
                    <TouchableOpacity style={styles.button} onPress={() => { this._savePhoto() }}>
                        <TabBarIcon name={'ios-image'} />
                        <Text style={styles.textButton}>Save Photo</Text>
                    </TouchableOpacity> :
                    this.state.savePhotoState === "saved" ?
                    <TouchableOpacity style={styles.button}>
                        <TabBarIcon name={'ios-checkmark-circle-outline'} />
                        <Text style={styles.textButton}>Photo Saved</Text>
                    </TouchableOpacity> :
                    <TouchableOpacity style={styles.button}>
                        <TabBarIcon name={'ios-sad'} />
                        <Text style={styles.textButton}>Failed to save</Text>
                    </TouchableOpacity>
                    }
                </View>
            </View>
        </ImageBackground>
    </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    paddingTop: 20,
    backgroundColor: 'black',
    justifyContent: 'space-between'
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    flexWrap: 'wrap'
  },
  topView: {
    flex: 1
  },
  bottomView: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    flexWrap: 'wrap',
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    opacity: 0.8
  },
  results: {
    flex: 5,
    display: 'flex',
    flexDirection: 'column',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20
  },
  analysisElementRow: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    paddingTop: 2,
    paddingBottom: 2,
    marginLeft: 5
  },
  resultText: {
    fontSize: 14
  },
  processingText: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    paddingLeft: 20,
    paddingRight: 20
  },
  tryAgainButton: {
    marginTop: 10
  },
  progress: {
    height: 15,
    backgroundColor: '#4286f4',
    borderRadius: 10
  },
  buttons: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: 'white'
  },
  button: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: 'white',
      justifyContent: 'space-around',
      alignItems: 'center'
  },
  textButton: {
      fontSize: 12,
      color: 'gray'
  },
});