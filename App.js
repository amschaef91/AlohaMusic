import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import { Audio, InterruptionModeAndroid, InterruptionModeIOS } from 'expo-av';
import { Feather } from '@expo/vector-icons';
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync();
setTimeout(SplashScreen.hideAsync, 2000);

const song = require('./music/ukulele.mp3')
const image = require('./assets/ukulele.png')

export default class App extends Component {
  state = {
    isPlaying: false,
    playbackInstance: null,
    volume: 1.0,
    isBuffering: false,
  }

  async componentDidMount() {
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      playThroughEarpieceAndroid: true,
      interruptionModeIOS: InterruptionModeIOS.DoNotMix,
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
      interruptionModeAndroid: InterruptionModeAndroid.DoNotMix
    });
    this.loadAudio();
  }

  handlePlayPause = async () => {
    const { isPlaying, playbackInstance } = this.state;
    isPlaying ? await playbackInstance.pauseAsync() : await playbackInstance.playAsync();
    this.setState({
      isPlaying: !isPlaying
    });
  }

  onPlaybackStatusUpdate = (status) => {
    this.setState({
      isBuffering: status.isBuffering
    });
  }

  async loadAudio() {
    const playbackInstance = new Audio.Sound();
    const status = {
      shouldPlay: this.state.isPlaying,
      volume: this.state.volume,
    };
    playbackInstance.setOnPlaybackStatusUpdate(
      this.setOnPlaybackStatusUpdate
    );
    await playbackInstance.loadAsync(song, status, false);
    this.setState({
      playbackInstance
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.header}>Aloha Music</Text>
        <Image source={image} style={styles.image}></Image>
        <View style={styles.controls}>
          <TouchableOpacity onPress={this.handlePlayPause}>
            {this.state.isPlaying ?
              <Feather name="pause" size={32} color="black" /> :
              <Feather name="play" size={32} color="black" />
            }
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4e3cf',
    alignItems: 'center',
    justifyContent: 'center',
    foregroundColor: '#563822'
  },
  header: {
    justifyContent: 'center',
    textAlign: 'center',
    width: 300,
    backgroundColor: '#da9547',
    fontSize: 32,
    fontWeight: 'bold',
  },
  image: {
    height: 500,
    width: 300,
    marginTop: 40,
    marginBottom: 40,
  }
});
