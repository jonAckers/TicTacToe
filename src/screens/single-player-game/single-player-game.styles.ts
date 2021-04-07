import { colors } from '@utils';
import { StyleSheet, Platform, StatusBar } from 'react-native';

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		marginTop: Platform.OS === 'ios' ? '20%' : 40,
		paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
	},
	difficulty: {
		color: colors.lightGreen,
		fontSize: 26,
		textAlign: 'center',
		marginBottom: 20,
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
	results: {
		flexDirection: 'row',
		justifyContent: 'center',
		marginBottom: 60,
	},
	resultsBox: {
		backgroundColor: colors.lightGreen,
		borderWidth: 1,
		borderColor: colors.lightPurple,
		alignItems: 'center',
		padding: 15,
		marginHorizontal: 5,
	},
	resultsCount: {
		color: colors.darkPurple,
		fontSize: 24,
	},
	resultsTitle: {
		color: colors.darkPurple,
		fontSize: 18,
	},
});

export default styles;
