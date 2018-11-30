import React from 'react';
import { Text, StyleSheet, View, Linking, TouchableOpacity } from 'react-native';
import { Icon } from 'expo';

export default class AboutScreen extends React.Component {
  static navigationOptions = {
    title: 'About',
  };

  _visitWebiste(url) {
    Linking.openURL(url).catch(err => console.error('An error occurred', err));
  }

  render() {
    return(
      <View style={styles.container}>
        <Icon.Ionicons
          name={'md-qr-scanner'}
          size={120}
          color={'#4286f4'}
        />
        <Text style={styles.title}>Image Recognition App</Text>
        <Text style={styles.description}>
        Application powered by ParallelDots, which can directly tell you
        what's inside your photo!  
        </Text>
        
        <TouchableOpacity style={styles.infoThumbnail}>
          <Icon.Ionicons name={'ios-contact'} size={35} color={'#4286f4'} style={styles.icon} />
          {/* <Text style={styles.grayText}>Author: </Text> */}
          <Text>Bartek Stolarek</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.infoThumbnail} onPress={() => { this._visitWebiste('https://www.paralleldots.com/') }}>
          <Icon.Ionicons name={'ios-globe'} size={35} color={'#4286f4'} style={styles.icon} />
          <Text>Visit ParallelDots Page</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.infoThumbnail} onPress={() => { this._visitWebiste('https://github.com/BartekStolarek') }}>
          <Icon.Ionicons name={'logo-github'} size={35} color={'#4286f4'} style={styles.icon} />
          <Text>View app code on GitHub</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.infoThumbnail} onPress={() => { this._visitWebiste('https://pl.linkedin.com/in/bartosz-stolarek') }}>
          <Icon.Ionicons name={'logo-linkedin'} size={40} color={'#4286f4'} style={styles.icon} />
          <Text>Find author on LinkedIn</Text>
        </TouchableOpacity>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flex: 1,
    paddingTop: 15,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 20,
    paddingRight: 20
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold'
  },
  description: {
    color: 'gray',
    margin: 15
  },
  grayText: {
    color: 'gray'
  },
  info: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  infoThumbnail: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '65%',
    margin: 10,
  },
  icon: {
    marginRight: 20
  }
});
