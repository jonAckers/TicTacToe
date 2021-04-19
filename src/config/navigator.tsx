import React, { ReactElement, useEffect, useState, useRef } from 'react';
import {
	NavigationContainer,
	NavigationContainerRef,
	StackActions,
} from '@react-navigation/native';
import { createStackNavigator, StackNavigationOptions } from '@react-navigation/stack';
import * as Notifications from 'expo-notifications';

import {
	ChangePassword,
	ForgotPassword,
	Home,
	Login,
	MultiplayerGame,
	MultiplayerHome,
	Settings,
	SignUp,
	SinglePlayerGame,
} from '@screens';
import { colors } from '@utils';
import { useAuth } from '@contexts/auth';

export type StackNavigatorParams = {
	ChangePassword: undefined;
	ForgotPassword: undefined;
	Home: undefined;
	Login: { redirect: keyof StackNavigatorParams } | undefined;
	MultiplayerGame:
		| { gameId: string; invitee?: undefined }
		| { invitee: string; gameId?: undefined };
	MultiplayerHome: undefined;
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
	const { user } = useAuth();

	const navigatorRef = useRef<NavigationContainerRef | null>(null);
	const [isNavigatorReady, setIsNavigatorReady] = useState(false);

	useEffect(() => {
		if (user && isNavigatorReady) {
			const subscription = Notifications.addNotificationResponseReceivedListener(
				(response) => {
					const gameId = response.notification.request.content.data.gameId;

					if (
						navigatorRef.current?.getCurrentRoute()?.name === 'SinglePlayerGame' ||
						navigatorRef.current?.getCurrentRoute()?.name === 'MultiplayerGame'
					) {
						navigatorRef.current?.dispatch(
							StackActions.replace('MultiplayerGame', { gameId: gameId })
						);
					} else {
						navigatorRef.current?.navigate('MultiplayerGame', { gameId: gameId });
					}
				}
			);

			return () => subscription.remove();
		}
	}, [user, isNavigatorReady]);

	return (
		<NavigationContainer ref={navigatorRef} onReady={() => setIsNavigatorReady(true)}>
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
				<Stack.Screen
					name="MultiplayerGame"
					component={MultiplayerGame}
					options={{ headerShown: false }}
				/>
				<Stack.Screen
					name="MultiplayerHome"
					component={MultiplayerHome}
					options={{ title: 'Multiplayer' }}
				/>
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
