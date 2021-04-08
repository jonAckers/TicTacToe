import React, { ReactElement } from 'react';
import { View, TouchableOpacity, TouchableOpacityProps, ActivityIndicator } from 'react-native';

import styles from './button.styles';
import Text from '../text/text';
import { colors } from '@utils';

type ButtonProps = {
	text: string;
	loading?: boolean;
} & TouchableOpacityProps;

export default function Button({ text, loading, style, ...props }: ButtonProps): ReactElement {
	return (
		<View>
			<TouchableOpacity disabled={loading} style={[styles.button, style]} {...props}>
				{loading ? (
					<ActivityIndicator color={colors.darkPurple} />
				) : (
					<Text style={styles.text}>{text}</Text>
				)}
			</TouchableOpacity>
		</View>
	);
}
