import { StyleSheet } from 'react-native';

import { colors } from '@utils';

const styles = StyleSheet.create({
	button: {
		marginBottom: 20,
	},
	buttons: {
		marginTop: 80,
	},
	container: {
		alignItems: 'center',
		paddingTop: 120,
	},
	loggedInText: {
		color: colors.lightGreen,
		textAlign: 'center',
		fontSize: 16,
	},
	logo: {
		height: 150,
		maxWidth: '60%',
		resizeMode: 'contain',
	},
});

export default styles;
