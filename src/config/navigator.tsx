import React, { ReactElement } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, StackNavigationOptions } from '@react-navigation/stack';

import {
	ChangePassword,
	ForgotPassword,
	Home,
	Login,
	Settings,
	SignUp,
	SinglePlayerGame,
} from '@screens';
import { colors } from '@utils';

export type StackNavigatorParams = {
	ChangePassword: undefined;
	ForgotPassword: undefined;
	Home: undefined;
	Login: undefined;
	Settings: undefined;
	SignUp: { username: string } | undefined;
	SinglePlayerGame: undefined;
};

const Stack = createStackNavigator<StackNavigatorParams>();

const navigatorOptions: StackNavigationOptions = {
	headerStyle: {
		backgroundColor: colors.purple,
		shadowRadius: 0,
		shadowOffset: {
			height: 0,
			width: 0,
		},
	},
	headerTintColor: colors.lightGreen,
	headerTitleStyle: {
		fontFamily: 'DeliusUnicase_700Bold',
		fontSize: 24,
	},
	headerBackTitleStyle: {
		fontFamily: 'DeliusUnicase_400Regular',
		fontSize: 14,
	},
};

export default function Navigator(): ReactElement {
	return (
		<NavigationContainer>
			<Stack.Navigator initialRouteName="Home" screenOptions={navigatorOptions}>
				<Stack.Screen
					name="ChangePassword"
					component={ChangePassword}
					options={{ title: 'Change Password' }}
				/>
				<Stack.Screen
					name="ForgotPassword"
					component={ForgotPassword}
					options={{ title: 'Forgot Password' }}
				/>
				<Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
				<Stack.Screen name="Login" component={Login} />
				<Stack.Screen name="Settings" component={Settings} />
				<Stack.Screen name="SignUp" component={SignUp} options={{ title: 'Sign Up' }} />
				<Stack.Screen
					name="SinglePlayerGame"
					component={SinglePlayerGame}
					options={{ headerShown: false }}
				/>
			</Stack.Navigator>
		</NavigationContainer>
	);
}
