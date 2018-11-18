import React from 'react';
import { Container } from 'native-base';
import { View, TouchableOpacity, CameraRoll } from 'react-native';
import { Camera, } from 'expo';
import { Ionicons } from '@expo/vector-icons';
import PropTypes from 'prop-types';

class CameraPage extends React.Component {
    static propTypes = {
        error: PropTypes.string,
        loading: PropTypes.bool.isRequired,
    }

    constructor(props) {
        super(props);
        this.state = {
            hasCameraPermission: null,
            type: Camera.Constants.Type.back,
        };

        this.flip = this.flip.bind(this);
        this.snap = this.snap.bind(this);
    }

    flip = () => {
        this.setState({
            type: this.state.type === Camera.Constants.Type.back
                ? Camera.Constants.Type.front
                : Camera.Constants.Type.back,
        });
    }

    snap = () => {
        if (this.camera) {
            this.setState({
                isLoading: true
            });

            // let photo = this.camera.takePictureAsync();
            // CameraRoll.saveToCameraRoll(photo, 'photo');

            this.setState({
                isLoading: false
            });
        }
    };

    render() {
        return (
            <Container>
                <View style={{ flex: 1 }}>
                    <Camera style={[{ flex: 1 }]} type={this.state.type} ref={(ref) => { this.camera = ref }}>
                        <View
                            style={{
                                flex: 1,
                                backgroundColor: 'transparent',
                                flexDirection: 'row',
                            }}>
                            <TouchableOpacity
                                style={{ flex: 1, paddingBottom: 30, alignSelf: 'flex-end', alignItems: 'center' }}
                                onPress={this.flip}>
                                <Ionicons name="md-reverse-camera" size={52} color="white" />
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={this.snap}
                                style={{ flex: 1, paddingBottom: 30, alignSelf: 'flex-end', alignItems: 'center' }}>
                                <Ionicons name="md-camera" size={52} color="white" />
                            </TouchableOpacity>
                        </View>
                    </Camera>
                </View>
            </Container>
        );
    }
};

export default CameraPage;
