import React, { ReactElement, forwardRef } from 'react';
import {
	StyleSheet,
	TextInput as NativeTextInput,
	TextInputProps as NativeTextInputProps,
} from 'react-native';

import { colors } from '@utils';

// TODO: move to separate file
const styles = StyleSheet.create({
	input: {
		height: 50,
		width: '100%',
		borderBottomWidth: 1,
		borderColor: colors.lightGreen,
		backgroundColor: colors.purple,
		padding: 10,
		color: colors.lightGreen,
		fontFamily: 'DeliusUnicase_400Regular',
	},
});

const TextInput = forwardRef<NativeTextInput, NativeTextInputProps>(
	({ style, ...props }: NativeTextInputProps, ref): ReactElement => (
		<NativeTextInput
			ref={ref}
			placeholderTextColor="#5d5379"
			style={[styles.input, style]}
			{...props}
		/>
	)
);

TextInput.displayName = 'TextInput';

export default TextInput;
