import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {FC, useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  NativeSyntheticEvent,
  StyleSheet,
  TextInput,
  TextInputChangeEventData,
  TextInputKeyPressEventData,
  TouchableHighlight,
  View,
} from 'react-native';
import Typography from '../../components/atoms/Typography';
import {request} from '../../lib/utils/api';
import {Color} from '../../types/Color';
import Notification from '../../utils/Notification';
import {RootStackParamList} from '../Routes';
import {Room} from './Room.PlaylistContext';

interface JoinSessionProps
  extends NativeStackScreenProps<RootStackParamList, 'JoinSession'> {}

const JoinSession: FC<JoinSessionProps> = ({navigation}) => {
  const [pin, setPin] = useState(['', '', '', '']);
  const key1 = useRef<TextInput>(null);
  const key2 = useRef<TextInput>(null);
  const key3 = useRef<TextInput>(null);
  const key4 = useRef<TextInput>(null);

  const keys = useMemo(
    () => [key1, key2, key3, key4],
    [key1, key2, key3, key4],
  );

  const changeCode =
    (index: number) => (e: NativeSyntheticEvent<TextInputChangeEventData>) => {
      const newCode = [...pin];
      const input =
        e.nativeEvent.text[e.nativeEvent.text.length - 1].toUpperCase();

      newCode[index] = input;
      setPin(newCode);

      if (index >= pin.length) return;

      const next = keys[index + 1];
      next?.current?.focus();
    };

  const selectInput = (index: number) => () => {
    const newCode = [...pin].map((code, codeIndex) => {
      if (codeIndex >= index) return '';
      return code;
    });

    setPin(newCode);

    const emptyIndex = pin.findIndex(code => code === '');
    if (emptyIndex === -1) return;

    keys[emptyIndex].current?.focus();
  };

  const checkForBackSpace =
    (index: number) =>
    (event: NativeSyntheticEvent<TextInputKeyPressEventData>) => {
      if (index === 0) return;
      if (event.nativeEvent.key !== 'Backspace') return;
      keys[index - 1].current?.focus();
    };

  const reset = useCallback(() => {
    setPin(['', '', '', '']);
    setTimeout(() => {
      keys[0].current?.focus();
    }, 0);
  }, [keys]);

  const joinRoom = useCallback(
    async (code: string) => {
      try {
        const {content} = await request<Room>('GET', `/room/${code}`);
        console.log(content);
        navigation.popToTop();
        navigation.replace('Room', {pin: content.pin});
        Notification.show({
          icon: '🪩',
          message: `You've joined ${content.pin}, add some of your favorite tracks to keep the party going!`,
        });
      } catch (error) {
        reset();
        if (error === 404) {
          Notification.show({
            type: 'info',
            icon: '🕵️',
            message: `Oops! We can not find a fissa with the code ${code}. Try another code.`,
          });
        }
      }
    },
    [reset, navigation],
  );

  useEffect(() => {
    if (pin.includes('')) return;

    keys.forEach(key => key.current?.blur());

    joinRoom(pin.join(''));
  }, [reset, keys, joinRoom, pin]);

  useEffect(() => {
    keys[0].current?.focus();
  }, [keys]);

  return (
    <View style={styles.container}>
      <Typography style={styles.title} variant="h5">
        Enter the session code of the fissa you want to join
      </Typography>
      <View style={styles.code}>
        {pin.map((item, index) => (
          <View
            style={[
              styles.inputContainer,
              {
                borderColor:
                  index === pin.indexOf('') ? Color.main : Color.light,
              },
            ]}
            key={index}>
            <TextInput
              maxLength={1}
              ref={keys[index]}
              style={styles.input}
              value={item}
              onKeyPress={checkForBackSpace(index)}
              onChange={changeCode(index)}
              onFocus={selectInput(index)}
              placeholder="⦚"
              editable={pin.includes('')}
            />
          </View>
        ))}
      </View>
      <TouchableHighlight>
        <Typography
          variant="bodyM"
          style={{
            textAlign: 'center',
            opacity: pin.filter(Boolean).length ? 1 : 0.5,
          }}
          onPress={reset}>
          reset
        </Typography>
      </TouchableHighlight>
    </View>
  );
};

export default JoinSession;

const styles = StyleSheet.create({
  container: {
    marginTop: 72,
    paddingHorizontal: 24,
  },
  title: {
    textAlign: 'center',
  },
  code: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginVertical: 72,
  },
  inputContainer: {
    borderColor: Color.light,
    borderBottomWidth: 3,
    marginHorizontal: 16,
    paddingBottom: 8,
  },
  input: {
    fontSize: 56,
    color: Color.light,
    fontWeight: '700',
    minWidth: 56,
    textAlign: 'center',
  },
});
