import { StyleSheet } from 'react-native';

import { colors } from '@utils';

const styles = StyleSheet.create({
	container: {
		paddingHorizontal: 30,
		paddingVertical: 40,
	},
	otpActiveInputBox: {
		borderWidth: 1,
		borderColor: colors.lightPurple,
	},
	otpInputBox: {
		color: colors.lightGreen,
		fontFamily: 'DeliusUnicase_400Regular',
		fontSize: 24,
		borderWidth: 0,
		borderRadius: 0,
		backgroundColor: colors.purple,
		borderBottomWidth: 1,
		borderColor: colors.lightGreen,
	},
	otpText: {
		color: colors.lightGreen,
		fontSize: 20,
	},
	resendLink: {
		color: colors.lightGreen,
		fontSize: 18,
		textAlign: 'right',
		textDecorationLine: 'underline',
	},
});

export default styles;
