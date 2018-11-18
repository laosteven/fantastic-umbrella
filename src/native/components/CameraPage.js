import React from 'react';
import { Container } from 'native-base';
import { View, TouchableOpacity, Image, NativeModules, ImageEditor, ImageStore } from 'react-native';
import { Camera } from 'expo';
import { Ionicons } from '@expo/vector-icons';
import PropTypes from 'prop-types';
import firebaseConfig from '../../constants/firebase';
import { Firebase } from '../../lib/firebase';

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

            const options = {base64:true};
            this.camera.takePictureAsync({metadata: options}).then(data => {
                console.log(data);

                var data = new FormData();
                data.append('theFile', { uri: data.uri, name: 'profile_photo.jpg', type: 'image/jpg' });
            
                fetch(firebaseConfig.apiUrl + firebaseConfig.apiKey, {
                    method: 'POST',
                    body: data
                })
                    .then((response) => response.json())
                    .then((responseJson) => {
            
                        alert(JSON.stringify(responseJson))
                        alert(responseJson)
            
                    })
                    .catch((error) => {
                        console.error(error);
                        alert(error)
                    });

                // const metadata = { contentType: 'image/jpeg' };
                // const task = ref.child('test').put(data.uri, metadata);
                // task
                //     .then(snapshot => snapshot.ref.getDownloadURL())
                //     .then(url => console.log(url))
                //     .catch((e) => {
                //         console.log(e);
                //     });
                
                // Image.getSize(data.uri, (width, height) => {
                //     let imageSettings = {
                //         offset: { x: 0, y: 0 },
                //         size: { width: width, height: height }
                //     };
                //     ImageEditor.cropImage(data.uri, imageSettings, (uri) => {
                //         ImageStore.getBase64ForTag(uri, (base64) => {
                //             fetch(firebaseConfig.apiUrl + firebaseConfig.apiKey, {
                //                 method: 'POST',
                //                 headers: {
                //                   Accept: 'application/json',
                //                   'Content-Type': 'multipart/form-data',
                //                 },
                //                 body: JSON.stringify({
                //                     "requests": [
                //                         {
                //                             "image": {
                //                                 "content": 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRYXVTbxmHQuOogxDeNx7U6z7neHX4kOQPZEBLG5nzQZoMMhkFN'
                //                             },
                //                             "features": [
                //                                 {
                //                                     "type":"FACE_DETECTION",
                //                                     "maxResults": 10
                //                                 }
                //                             ]
                //                         }
                //                     ]
                //                 })
                //             }).done((response) => {
                //                 console.log(response);
                //                 // let json = response.json();

                //             }, (err) => {
                //                 console.error('promise rejected')
                //                 console.error(err)
                //             });
                //         }, e => console.warn("getBase64ForTag: ", e))
                //     }, e => console.warn("cropImage: ", e))
                // })

                // ImageStore.getBase64ForTag(data.uri, (base64) => {
                //     console.log(base64);
                //     fetch(firebaseConfig.apiUrl + firebaseConfig.apiKey, {
                //         method: 'POST',
                //         body: JSON.stringify({
                //             "requests": [
                //                 {
                //                     "image": {
                //                         "content": base64
                //                     },
                //                     "features": [
                //                         {
                //                             "type": "LABEL_DETECTION"
                //                         }
                //                     ]
                //                 }
                //             ]
                //         })
                //     }).then((response) => {
                //         console.log(response);
                //         return response.json();
                //     }, (err) => {
                //         console.error('promise rejected')
                //         console.error(err)
                //     });
                // }, (reason) => console.error(reason));

                // console.log(data);

                // const image = {
                //     uri: data.uri,
                //     type: 'image/jpeg',
                //     name: 'img' + '-' + Date.now() + '.jpg'
                // }
                // const imgBody = new FormData();
                // imgBody.append('image', image);
                // fetch(firebaseConfig.apiUrl + firebaseConfig.apiKey, {
                //     method: 'POST',
                //     body: JSON.stringify({
                //         "requests": [
                //             {
                //                 "image": {
                //                     "content": data
                //                 },
                //                 "features": [
                //                     {
                //                         "type": "LABEL_DETECTION"
                //                     }
                //                 ]
                //             }
                //         ]
                //     })
                // }).then((response) => {
                //     console.log(response)
                //     return response.json();
                // }, (err) => {
                //     console.error('promise rejected')
                //     console.error(err)
                // });

                // NativeModules.RNImageToBase64.getBase64String(data.uri, (err, base64) => {
                //     if (err) {
                //         console.error(err)
                //     }
                //     console.log(base64);

                //     let result = this.sendToGoogleCloud(base64);
                //     console.log(result);

                //     this.setState({
                //         isLoading: false
                //     });
                // });
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
