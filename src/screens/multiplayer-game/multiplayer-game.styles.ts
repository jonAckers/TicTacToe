import { Platform, StatusBar, StyleSheet } from 'react-native';

import { colors } from '@utils';

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		marginTop: Platform.OS === 'ios' ? '20%' : 40,
		paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
	},
	modal: {
		position: 'absolute',
		backgroundColor: colors.lightPurple,
		bottom: '2%',
		left: 30,
		right: 30,
		padding: 25,
		borderWidth: 3,
		borderColor: colors.lightGreen,
	},
	modalText: {
		color: colors.lightGreen,
		fontSize: 30,
		textAlign: 'center',
		marginBottom: 25,
	},
	turn: {
		color: colors.lightGreen,
		fontSize: 22,
		textAlign: 'center',
		marginBottom: 20,
	},
	gameInfo: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		marginBottom: 80,
	},
	playerName: {
		color: colors.darkPurple,
	},
	playerUsername: {
		color: colors.darkPurple,
		fontSize: 12,
	},
	player: {
		width: '40%',
		backgroundColor: colors.lightGreen,
		borderWidth: 1,
		borderColor: colors.lightPurple,
		padding: 10,
	},
	playerTurn: {
		borderWidth: 3,
	},
	vs: {
		width: '10%',
	},
	vsText: {
		color: colors.lightGreen,
		textAlign: 'center',
	},
});

export default styles;
