import { StyleSheet } from 'react-native';

import { colors, globalStyles } from '@utils';

const styles = StyleSheet.create({
	...globalStyles,
	item: {
		backgroundColor: colors.purple,
		padding: 15,
		borderTopWidth: 1,
		borderColor: colors.lightPurple,
		marginBottom: 20,
	},
	itemBackground: {
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
	},
	itemTitle: {
		color: colors.lightGreen,
		textAlign: 'center',
		fontSize: 20,
		marginBottom: 10,
	},
	loading: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	newGameButton: {
		backgroundColor: colors.lightPurple,
		padding: 20,
		paddingBottom: 30,
	},
	newGameButtonText: {
		color: colors.lightGreen,
		textAlign: 'center',
		fontSize: 20,
	},
});

export default styles;
