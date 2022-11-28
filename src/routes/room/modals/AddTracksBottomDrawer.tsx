import React, {FC, useState} from 'react';
import {View, TextInput, StyleSheet} from 'react-native';
import {SharedElement} from 'react-navigation-shared-element';

import BottomDrawer from '../../../components/atoms/BottomDrawer';
import Button from '../../../components/atoms/Button';
import DeleteIcon from '../../../components/atoms/icons/DeleteIcon';
import {useDebounce} from '../../../hooks/useDebounce';
import {Color} from '../../../lib/types/Theme';
import {useAddContext} from '../../../providers/AddTracksProvider';

interface AddContextBottomDrawerProps {
  onSearch?: (value: string) => void;
}

export const AddContextBottomDrawer: FC<AddContextBottomDrawerProps> = ({
  onSearch,
}) => {
  const {selectedTracks, addToQueue, reset} = useAddContext();

  const [search, setSearch] = useState('');

  useDebounce(search, 500, newSearch => {
    console.log(newSearch);
    onSearch && onSearch(newSearch);
  });

  return (
    <SharedElement id="tracks-to-add-drawer">
      <View style={styles.view}>
        <BottomDrawer action={reset} actionIcon={DeleteIcon}>
          <Button
            inverted
            style={styles.button}
            title={`Add ${selectedTracks.length} tracks`}
            onPress={addToQueue}
            disabled={selectedTracks.length <= 0}
          />
          <TextInput
            value={search}
            style={styles.searchInput}
            placeholder="Search"
            onChange={e => setSearch(e.nativeEvent.text)}
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
    marginTop: 16,
  },
  searchInput: {
    marginVertical: 16,
    padding: 16,
    backgroundColor: Color.light,
    color: Color.dark,
    borderRadius: 8,
  },
});
