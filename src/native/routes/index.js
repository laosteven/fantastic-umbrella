import React from 'react';
import { Scene, Tabs, Stack } from 'react-native-router-flux';
import { Icon } from 'native-base';

import DefaultProps from '../constants/navigation';

import RecipesContainer from '../../containers/Recipes';
import RecipeViewComponent from '../components/Recipe';

import TipsComponent from '../components/Tips';
import CameraPageComponent from '../components/CameraPage';
import CameraPageContainer from '../../containers/CameraPage';
import SuccessComponent from '../components/Success';

const Index = (
  <Stack hideNavBar>
    <Scene hideNavBar>
      <Tabs
        key="tabbar"
        swipeEnabled
        type="replace"
        showLabel={false}
        {...DefaultProps.tabProps}
      >
        <Stack
          key="camera"
          title="CAMERA"
          icon={() => <Icon name="camera" {...DefaultProps.icons} />}
          {...DefaultProps.navbarProps}
        >
          <Scene key="home" component={CameraPageContainer} Layout={CameraPageComponent} />
        </Stack>

        <Stack
          key="tips"
          title="TIPS"
          icon={() => <Icon name="book" {...DefaultProps.icons} />}
          {...DefaultProps.navbarProps}
        >
          <Scene key="recipes" component={TipsComponent} />
        </Stack>

        <Stack
          key="success"
          title="SUCCESS"
          icon={() => <Icon name="trophy" {...DefaultProps.icons} />}
          {...DefaultProps.navbarProps}
        >
          <Scene key="success" component={SuccessComponent}/>
        </Stack>
      </Tabs>
    </Scene>
  </Stack>
);

export default Index;
