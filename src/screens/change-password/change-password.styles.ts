import { StyleSheet } from 'react-native';

import { colors, globalStyles } from '@utils';

const styles = StyleSheet.create({
	...globalStyles,
	text: {
		color: colors.lightGreen,
		marginBottom: 20,
	},
});

export default styles;
