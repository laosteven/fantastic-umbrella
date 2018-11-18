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

                
                // let body = {
                //     "requests": [
                //         {
                //             "image": {
                //                 "source": {
                //                     "imageUri": "https://static.standard.co.uk/s3fs-public/thumbnails/image/2018/03/27/09/meghan-markle-27.03.18.jpg"
                //                 }
                //             },
                //             "features": [
                //                 {
                //                     "type": "FACE_DETECTION",
                //                     "maxResults": 1
                //                 }
                //             ]
                //         }
                //     ]
                // }
                // axios.post('https://vision.googleapis.com/v1/images:annotate?key=AIzaSyAUTBKdqmia8kPKUu_1GwYtDd87F0Mwj-k', body)
                // .then((response) => console.log(response));
                
                Image.getSize(data.uri, (width, height) => {
                    let imageSettings = {
                        offset: { x: 0, y: 0 },
                        size: { width: width, height: height }
                    };
                    ImageEditor.cropImage(data.uri, imageSettings, (uri) => {
                        ImageStore.getBase64ForTag(uri, (base64) => {


                            var storageRef = Firebase.storage().ref();
                            var imageRef = storageRef.child("images");
                            var testRef = imageRef.child(new Date() + "-test.jpg");
                            
                            // var task = testRef.put(blob);
                            // var task = testRef.put(new File(base64, data.uri));
                            var task = testRef.putString(base64, 'raw')

                            task.on('state_changed', function(snapshot){
                                // Observe state change events such as progress, pause, and resume
                                // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                                var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                                console.log('Upload is ' + progress + '% done');
                                switch (snapshot.state) {
                                  case firebase.storage.TaskState.PAUSED: // or 'paused'
                                    console.log('Upload is paused');
                                    break;
                                  case firebase.storage.TaskState.RUNNING: // or 'running'
                                    console.log('Upload is running');
                                    break;
                                }
                              }, function(error) {
                                // Handle unsuccessful uploads
                              }, function() {
                                // Handle successful uploads on complete
                                // For instance, get the download URL: https://firebasestorage.googleapis.com/...
                                task.snapshot.ref.getDownloadURL().then(function(downloadURL) {
                                  console.log('File available at', downloadURL);
                                  
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

                            // let body = {
                            //     "requests": [
                            //         {
                            //             "image": {
                            //                 "content": base64
                            //             },
                            //             "features": [
                            //                 {
                            //                     "type": "FACE_DETECTION",
                            //                     "maxResults": 1
                            //                 }
                            //             ]
                            //         }
                            //     ]
                            // }
                            // axios.post('https://vision.googleapis.com/v1/images:annotate?key=AIzaSyAUTBKdqmia8kPKUu_1GwYtDd87F0Mwj-k', body)
                            // .then((response) => console.log(response));

                            // fetch("https://vision.googleapis.com/v1/images:annotate?key=AIzaSyAUTBKdqmia8kPKUu_1GwYtDd87F0Mwj-k", {
                            //     method: 'POST',
                            //     headers: { "Content-Type": "application/json" },
                            //     body: JSON.stringify({
                            //         "requests": [
                            //           {
                            //             "image": {
                            //               "source": {
                            //                 "imageUri": "https://static.standard.co.uk/s3fs-public/thumbnails/image/2018/03/27/09/meghan-markle-27.03.18.jpg"
                            //               }
                            //             },
                            //             "features": [
                            //               {
                            //                 "type": "FACE_DETECTION",
                            //                 "maxResults": 1
                            //               }
                            //             ]
                            //           }
                            //         ]
                            //        })
                            // }).done((response) => {
                            //     console.log(response);
                            //     // let json = response.json();

                            // }, (err) => {
                            //     console.error('promise rejected')
                            //     console.error(err)
                            // });
                        }, e => console.log(e))
                    }, e => console.log(e))
                })
            });

        }
    };

    sendToGoogleCloud = (base64) => {
        fetch(FirebaseRef.apiUrl + FirebaseRef.apiKey, {
            method: 'POST',
            body: JSON.stringify({
                "requests": [
                    {
                        "image": {
                            "content": base64
                        },
                        "features": [
                            {
                                "type": "LABEL_DETECTION"
                            }
                        ]
                    }
                ]
            })
        }).then((response) => {
            return response.json();
        }, (err) => {
            console.error('promise rejected')
            console.error(err)
        });
    }

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
                                right: 0
                            }}>
                            <Image
                                style={{ opacity: 0.8, alignSelf: 'center', alignItems: 'center' }}
                                source={require("../../images/overlay_canvas.png")} />
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
