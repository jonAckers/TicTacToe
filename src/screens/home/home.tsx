import React, { ReactElement, useState } from 'react';
import { ScrollView, View, Image, Alert } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Auth } from 'aws-amplify';

import styles from './home.styles';
import { StackNavigatorParams } from '@config/navigator';
import { GradientBackground, Button, Text } from '@components';
import { useAuth } from '@contexts/auth';

type HomeProps = {
	navigation: StackNavigationProp<StackNavigatorParams, 'Home'>;
};

export default function Home({ navigation }: HomeProps): ReactElement {
	const { user } = useAuth();
	const [signingOut, setSigningOut] = useState(false);

	return (
		<GradientBackground>
			<ScrollView contentContainerStyle={styles.container}>
				<Image style={styles.logo} source={require('@assets/logo.png')} />
				<View style={styles.buttons}>
					<Button
						onPress={() => navigation.navigate('SinglePlayerGame')}
						style={styles.button}
						text="Single Player"
					/>
					<Button
						onPress={() => {
							if (user) {
								navigation.navigate('MultiplayerHome');
							} else {
								navigation.navigate('Login', { redirect: 'MultiplayerHome' });
							}
						}}
						style={styles.button}
						text="Multiplayer"
					/>
					<Button
						onPress={async () => {
							if (user) {
								setSigningOut(true);
								try {
									await Auth.signOut();
								} catch (e) {
									Alert.alert('Error!', 'Error signing out!');
								}
								setSigningOut(false);
							} else {
								navigation.navigate('Login');
							}
						}}
						loading={signingOut}
						style={styles.button}
						text={user ? 'Logout' : 'Login'}
					/>
					<Button
						onPress={() => navigation.navigate('Settings')}
						style={styles.button}
						text="Settings"
					/>
					{user && (
						<Text weight="400" style={styles.loggedInText}>
							Logged in as <Text weight="700">{user.username}</Text>
						</Text>
					)}
				</View>
			</ScrollView>
		</GradientBackground>
	);
}
