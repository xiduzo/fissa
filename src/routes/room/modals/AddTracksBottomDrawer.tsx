import React, {FC} from 'react';
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
import Typography from '../../../components/atoms/Typography';
import {Color} from '../../../lib/types/Theme';
import {useAddContext} from '../../../providers/AddTracksProvider';

export const AddContextBottomDrawer: FC<{filterText?: string}> = ({
  filterText,
}) => {
  const {selectedTracks, addToQueue, reset, search, setSearch} =
    useAddContext();

  const handleSearch = (e: NativeSyntheticEvent<TextInputChangeEventData>) => {
    setSearch(e.nativeEvent.text);
  };

  return (
    <View style={styles.view}>
      <BottomDrawer
        action={reset}
        title={
          <View style={styles.searchInput}>
            <TextInput
              style={{paddingVertical: 16, flex: 1}}
              value={search}
              placeholder={filterText || 'Filter'}
              placeholderTextColor={Color.dark + 80}
              onChange={handleSearch}
            />
            <Typography
              color={search ? 'dark' : 'light'}
              onPress={() => setSearch('')}>
              clear
            </Typography>
          </View>
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
  );
};

const SharedAddContextBottomDrawer = () => {
  return (
    <SharedElement id="tracks-to-add-drawer">
      <AddContextBottomDrawer />
    </SharedElement>
  );
};

export default SharedAddContextBottomDrawer;

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
    paddingHorizontal: 16,
    backgroundColor: Color.light,
    color: Color.dark,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
