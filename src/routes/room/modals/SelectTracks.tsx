import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {FC, useEffect} from 'react';
import IconButton from '../../../components/atoms/IconButton';
import CLoseIcon from '../../../components/atoms/icons/CloseIcon';
import Tracks from '../../../components/organisms/Tracks';
import {useAddContext} from '../../../providers/AddTracksProvider';
import BaseView from '../../../components/templates/BaseView';
import {SharedElementStackParamList} from '../../../lib/interfaces/StackParams';
import AddContextBottomDrawer from './AddTracksBottomDrawer';

interface SelectTracksProps
  extends NativeStackScreenProps<SharedElementStackParamList, 'SelectTracks'> {}

const SelectTracks: FC<SelectTracksProps> = ({route, navigation}) => {
  const {selectedTracks, addTrack, removeTrack, cancel, search} =
    useAddContext();

  const {playlistId} = route.params;

  const toggleTrack = (trackId: string) => {
    if (selectedTracks.includes(trackId)) {
      removeTrack(trackId);
      return;
    }

    addTrack(trackId);
  };

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <IconButton title="cancel" onPress={cancel}>
          <CLoseIcon />
        </IconButton>
      ),
    });
  }, [navigation, cancel]);

  return (
    <BaseView noPadding>
      <Tracks
        navigation={navigation}
        playlistId={playlistId}
        selectedTracks={selectedTracks}
        toggleTrack={toggleTrack}
        filter={search}
      />
      <AddContextBottomDrawer />
    </BaseView>
  );
};

export default SelectTracks;
