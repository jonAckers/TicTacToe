import { StyleSheet } from 'react-native';

import { colors, globalStyles } from '@utils';

const styles = StyleSheet.create({
	...globalStyles,
	choice: {
		backgroundColor: colors.lightGreen,
		padding: 10,
		margin: 5,
	},
	choices: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		marginTop: 10,
		marginHorizontal: -5,
	},
	choiceText: {
		color: colors.darkPurple,
		fontSize: 16,
	},
	field: {
		marginBottom: 30,
	},
	label: {
		color: colors.lightGreen,
		fontSize: 22,
	},
	switchField: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
});

export default styles;
