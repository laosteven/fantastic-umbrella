import React from 'react';
import {
    Container, Content, Text, H1, H2, H3,
} from 'native-base';
import {  View, TouchableOpacity } from 'react-native';
import { Camera } from 'expo';


state = {
    hasCameraPermission: null,
    type: Camera.Constants.Type.back,
};

const CameraPage = () => {
    return (
        <Container>
                <View style={{ flex: 1 }}>
                    <Camera style={{ flex: 1 }} type={this.state.type}>
                        <View
                            style={{
                                flex: 1,
                                backgroundColor: 'transparent',
                                flexDirection: 'row',
                            }}>
                            <TouchableOpacity
                                style={{
                                    flex: 0.1,
                                    alignSelf: 'flex-end',
                                    alignItems: 'center',
                                }}
                                onPress={() => {
                                    this.setState({
                                        type: this.state.type === Camera.Constants.Type.back
                                            ? Camera.Constants.Type.front
                                            : Camera.Constants.Type.back,
                                    });
                                }}>
                                <Text
                                    style={{ fontSize: 18, marginBottom: 10, color: 'white' }}>
                                    {' '}Flip{' '}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </Camera>
                </View>
        </Container>
    );
};

export default CameraPage;
