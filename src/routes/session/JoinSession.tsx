import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {FC, useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  NativeSyntheticEvent,
  StyleSheet,
  TextInput,
  TextInputChangeEventData,
  TextInputKeyPressEventData,
  View,
} from 'react-native';
import Button from '../../components/atoms/Button';
import Typography from '../../components/atoms/Typography';
import BaseView from '../../components/templates/BaseView';
import {Room} from '../../lib/interfaces/Room';
import {request} from '../../lib/utils/api';
import {Color} from '../../lib/types/Theme';
import Notification from '../../lib/utils/Notification';
import {RootStackParamList} from '../../lib/interfaces/StackParams';
import {useRoom} from '../../hooks/useRoom';

interface JoinSessionProps
  extends NativeStackScreenProps<RootStackParamList, 'JoinSession'> {}

const JoinSession: FC<JoinSessionProps> = ({navigation}) => {
  const {joinRoom} = useRoom();

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
      const input = e.nativeEvent.text.toUpperCase();

      if (!input.match(/\w/)) return;
      if (input.match(/\d/)) return;

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
      if (event.nativeEvent?.key.toLowerCase() !== 'backspace') return;
      keys[index - 1].current?.focus();
    };

  const reset = useCallback(() => {
    setPin(['', '', '', '']);
    setTimeout(() => {
      keys[0].current?.focus();
    }, 0);
  }, [keys]);

  const tryJoinRoom = useCallback(
    async (code: string) => {
      try {
        const {
          content: {pin},
        } = await request<Room>('GET', `/room/${code}`);
        joinRoom(pin);
        navigation.popToTop();
        navigation.replace('Room', {pin});
        Notification.show({
          icon: '🪩',
          message: `You've joined ${pin}, add some of your favorite tracks to keep the party going!`,
        });
      } catch (error) {
        reset();
        if (error === 404) {
          Notification.show({
            type: 'info',
            icon: '🕵️',
            message: `Oops! We could not find a fissa with the code ${code}. Try another code.`,
          });
        }
      }
    },
    [reset, navigation],
  );

  useEffect(() => {
    if (pin.includes('')) return;

    keys.forEach(key => key.current?.blur());

    tryJoinRoom(pin.join(''));
  }, [reset, keys, tryJoinRoom, pin]);

  useEffect(() => {
    keys[0].current?.focus();
  }, [keys]);

  return (
    <BaseView style={styles.container}>
      <Typography style={styles.title} variant="h5">
        Enter the code of the fissa you would like to join
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
      <Button
        variant="text"
        onPress={reset}
        disabled={!pin.includes('')}
        title="reset"
      />
    </BaseView>
  );
};

export default JoinSession;

const styles = StyleSheet.create({
  container: {
    paddingTop: 72,
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
