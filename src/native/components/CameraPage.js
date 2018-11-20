import React from 'react';
import { Container } from 'native-base';
import { View, TouchableOpacity, Image, NativeModules, ImageEditor, ImageStore } from 'react-native';
import { Camera } from 'expo';
import { Ionicons } from '@expo/vector-icons';
import PropTypes from 'prop-types';
import firebaseConfig from '../../constants/firebase';
import { Firebase } from '../../lib/firebase';
import axios from 'axios';

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

    async componentWillMount() {
        await Permissions.askAsync(Permissions.CAMERA);
        await Permissions.askAsync(Permissions.CAMERA_ROLL);
        this.setState({ hasCameraPermission: status === 'granted' });
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

            this.camera.takePictureAsync().then(data => {
                console.log(data);
                Image.getSize(data.uri, (width, height) => {
                    let imageSettings = {
                        offset: { x: 0, y: 0 },
                        size: { width: width, height: height }
                    };

                    // Convert image to base64
                    ImageEditor.cropImage(data.uri, imageSettings, (uri) => {
                        ImageStore.getBase64ForTag(uri, (base64) => {

                            // Define path for Firebase
                            var storageRef = Firebase.storage().ref();
                            var imageRef = storageRef.child("images");
                            var testRef = imageRef.child(new Date() + "-test.jpg");

                            var task = testRef.putString(base64, 'raw');

                            task.on('state_changed', function (snapshot) {

                                // Display progress on console
                                var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                                console.log('Upload is ' + progress + '% done');

                            },
                                function (error) { },
                                function () {
                                    task.snapshot.ref.getDownloadURL().then(function (downloadURL) {

                                        // Display download link of uploaded file
                                        console.log('File available at', downloadURL);

                                        // Send POST request to Vision API
                                        let body = {
                                            "requests": [
                                                {
                                                    "image": {
                                                        "source": {
                                                            "imageUri": downloadURL
                                                        }
                                                    },
                                                    "features": [
                                                        {
                                                            "type": "FACE_DETECTION",
                                                            "maxResults": 1
                                                        }
                                                    ]
                                                }
                                            ]
                                        }
                                        axios.post('https://vision.googleapis.com/v1/images:annotate?key=AIzaSyAUTBKdqmia8kPKUu_1GwYtDd87F0Mwj-k', body)
                                            .then((response) => console.log(response));
                                    });
                                });
                        }, e => console.log(e))
                    }, e => console.log(e))
                })
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
                                position: 'absolute',
                                top: 0,
                                bottom: 0,
                                left: 0,
                                right: 0,
                                flex: 1,
                                justifyContent: 'center', // Used to set Text Component Vertically Center
                                alignItems: 'center'
                            }}>
                            <Image
                                style={{ opacity: 0.8, alignSelf: 'center', justifyContent: 'center', width: "90%", height: "90%" }}
                                source={require("../../images/overlay_canvas_2x.png")}
                                resizeMode={Image.resizeMode.cover} />
                        </View>
                        <View
                            style={{
                                flex: 1,
                                backgroundColor: 'transparent',
                                flexDirection: 'row',
                            }}>
                            <TouchableOpacity
                                style={{ flex: 1, paddingBottom: 30, alignSelf: 'flex-end', alignItems: 'center' }}
                                onPress={this.flip}>
                                <Ionicons style={{ opacity: 0.8 }} name="md-reverse-camera" size={52} color="white" />
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={this.snap}
                                style={{ flex: 1, paddingBottom: 30, alignSelf: 'flex-end', alignItems: 'center' }}>
                                <Ionicons style={{ opacity: 0.8 }} name="md-camera" size={52} color="white" />
                            </TouchableOpacity>
                        </View>
                    </Camera>
                </View>
            </Container>
        );
    }
};

export default CameraPage;
