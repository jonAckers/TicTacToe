import React, { ReactElement } from 'react';
import { ScrollView, View, Image } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';

import styles from './home.styles';
import { StackNavigatorParams } from '@config/navigator';
import { GradientBackground, Button } from '@components';

type HomeProps = {
	navigation: StackNavigationProp<StackNavigatorParams, 'Home'>;
};

export default function Home({ navigation }: HomeProps): ReactElement {
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
					<Button style={styles.button} text="Multiplayer" />
					<Button style={styles.button} text="Login" />
					<Button
						onPress={() => navigation.navigate('Settings')}
						style={styles.button}
						text="Settings"
					/>
				</View>
			</ScrollView>
		</GradientBackground>
	);
}
