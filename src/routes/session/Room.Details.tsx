import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React, {FC, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Action from '../../components/atoms/Action';
import ArrowUpIcon from '../../components/atoms/icons/ArrowUpIcon';
import Typography from '../../components/atoms/Typography';
import Popover from '../../components/molecules/Popover';
import {Color} from '../../types/Color';
import {RootStackParamList} from '../Routes';

interface RoomDetailsProps {
  pin: string;
  navigation: NativeStackNavigationProp<RootStackParamList, 'Room', undefined>;
  leaveRoom: () => void;
}

const RoomDetails: FC<RoomDetailsProps> = ({pin, navigation, leaveRoom}) => {
  const [showRoomDetails, setShowRoomDetails] = useState(false);

  return (
    <View>
      <LinearGradient
        {...Color.gradient}
        style={{
          borderRadius: 6,
        }}>
        <Typography
          variant="bodyM"
          style={{
            color: Color.dark,
            fontWeight: 'bold',
            paddingHorizontal: 4,
            paddingVertical: 2,
          }}
          onPress={() => setShowRoomDetails(true)}>
          {pin}
        </Typography>
      </LinearGradient>
      <Popover
        visible={!!showRoomDetails}
        onRequestClose={() => setShowRoomDetails(false)}>
        <Typography variant="h2" style={styles.popoverText}>
          {pin}
        </Typography>
        <Action
          title="Leave session"
          subtitle="No worries, you can always come back"
          inverted
          onPress={() => {
            leaveRoom();
            setShowRoomDetails(false);
            navigation.replace('Home');
          }}
          icon={
            <ArrowUpIcon
              style={{
                tintColor: Color.dark + '40',
              }}
            />
          }
        />
      </Popover>
    </View>
  );
};

export default RoomDetails;

const styles = StyleSheet.create({
  popoverText: {
    color: Color.dark,
    textAlign: 'center',
  },
});
