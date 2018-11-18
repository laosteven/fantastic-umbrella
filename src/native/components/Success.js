import Expo from 'expo';
import * as ExpoPixi from 'expo-pixi';
import React, { Component } from 'react';
import { Image, StyleSheet, View, Text, TextInput, Button } from 'react-native';
import { Container } from 'native-base';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  sketch: {
    height: '50%',
    backgroundColor: 'white'
  },
  image: {
    height: '50%',
    backgroundColor: 'orange',
  },
  firstText: {
    fontSize: 18,
    alignSelf: 'center',
  },
  inputText: {
    alignSelf: 'center',
    fontSize: 18,
    textAlign: 'center',
  }
});

state = {
  image: null,
  strokeColor: Math.random() * 0xffffff,
  strokeWidth: 8,
  text: ''
};

onChangeAsync = async ({ width, height }) => {
  const options = {
    format: 'png',
    quality: 0.1,
    result: 'file',
    height,
    width,
  };
  const uri = await Expo.takeSnapshotAsync(this.sketch, options);
  this.setState({
    image: { uri },
    strokeWidth: Math.random() * 30 + 10,
    strokeColor: Math.random() * 0xffffff,
  });
};

onReady = () => {
  console.log('ready!');
};

const Success = () => (
  <Container>
    <View style={styles.container}>
      <Text style={styles.firstText}>I certified this to be a true likeness of </Text>
      <TextInput style={styles.inputName}
        onChangeText={(text) => this.setState({ text: { text } })}
        value={this.state.text}
      >Applicant's name or child</TextInput>
      <Text style={styles.firstText}>
        Guarantor's signature:
      </Text>
      <ExpoPixi.Sketch
        ref={ref => (this.sketch = ref)}
        style={styles.sketch}
        strokeColor={this.state.strokeColor}
        strokeWidth={this.state.strokeWidth}
        strokeAlpha={1}
        onChange={this.onChangeAsync}
        onReady={this.onReady}
      />
      <Image style={styles.image} source={this.state.image} />
      <Button title="Submit"></Button>
    </View>
  </Container>
);

export default Success;
