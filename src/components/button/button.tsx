import React, { ReactElement } from 'react';
import { View, TouchableOpacity, TouchableOpacityProps } from 'react-native';

import styles from './button.styles';
import Text from '../text/text';

type ButtonProps = {
	text: string;
} & TouchableOpacityProps;

export default function Button({ text, style, ...props }: ButtonProps): ReactElement {
	return (
		<View>
			<TouchableOpacity style={[styles.button, style]} {...props}>
				<Text style={styles.text}>{text}</Text>
			</TouchableOpacity>
		</View>
	);
}
