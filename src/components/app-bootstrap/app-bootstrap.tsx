import React, { ReactElement, ReactNode, useEffect, useState } from 'react';
import AppLoading from 'expo-app-loading';
import {
	useFonts,
	DeliusUnicase_400Regular,
	DeliusUnicase_700Bold,
} from '@expo-google-fonts/delius-unicase';
import { Auth, Hub } from 'aws-amplify';
import * as Notifications from 'expo-notifications';

import { useAuth } from '@contexts/auth';
import { initNotifications } from '@utils';

Notifications.setNotificationHandler({
	handleNotification: async () => ({
		shouldShowAlert: true,
		shouldPlaySound: false,
		shouldSetBadge: false,
	}),
});

type AppBootstrapProps = {
	children: ReactNode;
};

export default function AppBootstrap({ children }: AppBootstrapProps): ReactElement {
	const [fontLoaded] = useFonts({ DeliusUnicase_400Regular, DeliusUnicase_700Bold });
	const [authLoaded, setAuthLoaded] = useState(false);
	const { setUser } = useAuth();

	useEffect(() => {
		const checkCurrentUser = async () => {
			try {
				const response = await Auth.currentAuthenticatedUser();
				setUser(response);
				initNotifications();
			} catch (e) {
				setUser(null);
			}
			setAuthLoaded(true);
		};

		checkCurrentUser();
	}, []);

	useEffect(() => {
		const hubListener = (hubData: any) => {
			const { data, event } = hubData.payload;
			switch (event) {
				case 'signOut':
					setUser(null);
					break;

				case 'signIn':
					setUser(data);
					initNotifications();
					break;

				default:
					break;
			}
		};
		Hub.listen('auth', hubListener);
		return () => Hub.remove('auth', hubListener);
	}, []);

	return fontLoaded && authLoaded ? <>{children}</> : <AppLoading />;
}
