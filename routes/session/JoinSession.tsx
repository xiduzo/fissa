import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {FC, useEffect, useRef, useState} from 'react';
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
import {Color} from '../../types/Color';
import Notification from '../../utils/Notification';
import {RootStackParamList} from '../Routes';

interface JoinSessionProps
  extends NativeStackScreenProps<RootStackParamList, 'JoinSession'> {}

const JoinSession: FC<JoinSessionProps> = ({navigation}) => {
  const [pin, setPin] = useState(['', '', '', '']);
  const key1 = useRef<TextInput>(null);
  const key2 = useRef<TextInput>(null);
  const key3 = useRef<TextInput>(null);
  const key4 = useRef<TextInput>(null);

  const keys = [key1, key2, key3, key4];

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
    console.log(index);
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

  const reset = () => {
    setPin(['', '', '', '']);
    setTimeout(() => {
      keys[0].current?.focus();
    }, 0);
  };

  useEffect(() => {
    if (pin.includes('')) return;

    keys.forEach(key => key.current?.blur());

    Notification.show({
      message: `Joined ${pin.join('')}`,
    });

    navigation.popToTop();
    navigation.replace('Room');
  }, [pin]);

  useEffect(() => {
    keys[0].current?.focus();
  }, []);

  return (
    <View style={styles.container}>
      <Typography style={styles.title} variant="h5">
        Enter session code of the fissa you want to join
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
  },
  title: {
    textAlign: 'center',
  },
  code: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginVertical: 72,
  },
  inputContainer: {
    borderColor: Color.light,
    borderBottomWidth: 3,
    display: 'flex',
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
