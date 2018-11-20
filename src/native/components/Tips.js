import React from 'react';
import { Container } from 'native-base';
import { ScrollView, Image, Text, View, Dimensions, StyleSheet } from 'react-native';

const input = Dimensions.get('window').width;

const styles = StyleSheet.create({
  reqView: {
    width: input,
    height: 2,
  },
  req: {
    fontSize: 49,
    padding: 20,
    alignContent: 'center'
  },
  mainView: {
    width: input,
    padding: 10
  },
  main: {
    fontSize: 16,
    width: 340,
    backgroundColor: 'white',
    padding: 10,
    textAlign: 'center',
    flexWrap: 'wrap',
    alignContent: 'center'
  },
  image: {
    width: 250,
    height: 118,
    alignSelf: 'center',
    marginTop: 50
  }
});

const Tips = () => (
  <Container style={{ flex: 1 }}>
    <ScrollView horizontal pagingEnabled style={{ width: input }}>
      <View style={styles.reqView}><Text style={styles.req}>
        Requirement 1
      </Text><View style={styles.mainView}><Text style={styles.main}>
          The photo must be taken in person by a commercial photographer.
        </Text><Image
            style={styles.image}
            source={require('../../images/maple-leaf-38777_960_720.png')} /></View></View>
      <View style={styles.reqView}><Text style={styles.req}>
        Requirement 2
      </Text><View style={styles.mainView}><Text style={styles.main}>
          Photos must be taken within the last six (6) months.
        </Text><Image
            style={styles.image}
            source={require('../../images/maple-leaf-38777_960_720.png')} /></View></View>
      <View style={styles.reqView}><Text style={styles.req}>
        Requirement 3
      </Text><View style={styles.mainView}><Text style={styles.main}>
          The photos must be taken against a plain white or light-coloured background with enough contrast between the background, facial features and clothing, so that the applicant’s features are clearly distinguishable against the background.
        </Text><Image
            style={styles.image}
            source={require('../../images/maple-leaf-38777_960_720.png')} /></View></View>
      <View style={styles.reqView}><Text style={styles.req}>
        Requirement 4
      </Text><View style={styles.mainView}><Text style={styles.main}>
          Applicant must show a neutral facial expression (no smiling, mouth closed) and look straight at the camera.
        </Text><Image
            style={styles.image}
            source={require('../../images/maple-leaf-38777_960_720.png')} /></View></View>
      <View style={styles.reqView}><Text style={styles.req}>
        Requirement 5
      </Text><View style={styles.mainView}><Text style={styles.main}>
          The photos must be clear, sharp and in focus.
        </Text><Image
            style={styles.image}
            source={require('../../images/maple-leaf-38777_960_720.png')} /></View></View>
      <View style={styles.reqView}><Text style={styles.req}>
        Requirement 6
      </Text><View style={styles.mainView}><Text style={styles.main}>
          The photos must show a full head without any head covering, unless it is worn for religious beliefs or medical reasons. However, the head covering must not cast shadows on the face and the full face must be clearly visible.
        </Text><Image
            style={styles.image}
            source={require('../../images/maple-leaf-38777_960_720.png')} /></View></View>
      <View style={styles.reqView}><Text style={styles.req}>
        Requirement 7
      </Text><View><Text style={styles.main}>
          Glare and shadows are unacceptable. The lighting must be uniform to avoid glare or shadows across the face or shoulders, around the ears or in the background.
        </Text><Image
            style={styles.image}
            source={require('../../images/maple-leaf-38777_960_720.png')} /></View></View>
    </ScrollView>
  </Container>
);

export default Tips;
