import { StyleSheet } from 'react-native';

import { colors } from '@utils';

const styles = StyleSheet.create({
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
	container: {
		paddingHorizontal: 30,
		paddingVertical: 40,
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
