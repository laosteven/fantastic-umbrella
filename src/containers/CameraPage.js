import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Camera } from 'expo';

class CameraPage extends Component {
    static propTypes = {
        Layout: PropTypes.func.isRequired,
        isLoading: PropTypes.bool.isRequired,
    }

    state = {
        hasCameraPermission: null,
        type: Camera.Constants.Type.back,
    };

    render = () => {
        const {
            locale,
            Layout,
            isLoading,
            successMessage,
        } = this.props;

        return (
            <Layout
                locale={locale}
                loading={isLoading}
                success={successMessage}
            />
        );
    }
}


const mapStateToProps = state => ({
    isLoading: state.status.loading || false,
});

const mapDispatchToProps = {
};

export default connect(mapStateToProps, mapDispatchToProps)(CameraPage);