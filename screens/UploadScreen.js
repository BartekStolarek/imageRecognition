import React from 'react';
import { StyleSheet, Button, Text, View, Image } from 'react-native';
import { ImagePicker } from 'expo';
export default class UploadScreen extends React.Component {
  state = {
    image: null
  }

  static navigationOptions = {
    title: 'Upload',
  };

  _pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
    });

    if (!result.cancelled) {
      this.setState({ image: result });
      this.props.navigation.navigate('Photo', { photo: result });
    }

  };

  render() {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Button
          title="Pick an image from camera roll"
          onPress={this._pickImage}
        />
      </View>
    );
  }
}
