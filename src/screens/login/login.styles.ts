import { StyleSheet } from 'react-native';

import { colors, globalStyles } from '@utils';

const styles = StyleSheet.create({
	...globalStyles,
	forgotPasswordLink: {
		color: colors.lightGreen,
		textAlign: 'right',
		fontSize: 12,
		marginTop: -15,
		marginBottom: 30,
		textDecorationLine: 'underline',
	},
	registerLink: {
		color: colors.lightGreen,
		textAlign: 'right',
		marginTop: 20,
		textDecorationLine: 'underline',
	},
});

export default styles;
