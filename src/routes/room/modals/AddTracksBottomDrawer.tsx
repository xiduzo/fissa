import React, {FC, useState} from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  NativeSyntheticEvent,
  TextInputChangeEventData,
} from 'react-native';
import {SharedElement} from 'react-navigation-shared-element';

import BottomDrawer from '../../../components/atoms/BottomDrawer';
import Button from '../../../components/atoms/Button';
import DeleteIcon from '../../../components/atoms/icons/DeleteIcon';
import {Color} from '../../../lib/types/Theme';
import {useAddContext} from '../../../providers/AddTracksProvider';

export const AddContextBottomDrawer: FC = () => {
  const {selectedTracks, addToQueue, reset, search, setSearch} =
    useAddContext();

  const handleSearch = (e: NativeSyntheticEvent<TextInputChangeEventData>) => {
    setSearch(e.nativeEvent.text);
  };

  return (
    <SharedElement id="tracks-to-add-drawer">
      <View style={styles.view}>
        <BottomDrawer
          action={reset}
          title={
            <TextInput
              value={search}
              style={styles.searchInput}
              placeholder="Filter"
              onChange={handleSearch}
            />
          }
          actionIcon={DeleteIcon}>
          <Button
            inverted
            style={styles.button}
            title={`Add ${selectedTracks.length} track${
              selectedTracks.length === 1 ? '' : 's'
            }`}
            onPress={addToQueue}
            disabled={selectedTracks.length <= 0}
          />
        </BottomDrawer>
      </View>
    </SharedElement>
  );
};

export default AddContextBottomDrawer;

const styles = StyleSheet.create({
  view: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  button: {
    marginTop: 32,
  },
  searchInput: {
    marginHorizontal: 16,
    flex: 1,
    padding: 16,
    backgroundColor: Color.light,
    color: Color.dark,
    borderRadius: 8,
  },
});
