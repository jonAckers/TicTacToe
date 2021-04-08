import React, { ReactElement, useRef, useState } from 'react';
import { Alert, ScrollView, TextInput as NativeTextInput, TouchableOpacity } from 'react-native';
import { Auth } from 'aws-amplify';

import styles from './login.styles';
import { Button, GradientBackground, TextInput, Text } from '@components';
import { StackNavigationProp } from '@react-navigation/stack';
import { StackNavigatorParams } from '@config/navigator';

type LoginProps = {
	navigation: StackNavigationProp<StackNavigatorParams, 'Login'>;
};

export default function Login({ navigation }: LoginProps): ReactElement {
	const passwordRef = useRef<NativeTextInput | null>(null);

	const [form, setForm] = useState({ username: 'test', password: 'password' });
	const [loading, setLoading] = useState(false);

	const setFormInput = (key: keyof typeof form, value: string) => {
		setForm({ ...form, [key]: value });
	};

	const login = async () => {
		setLoading(true);

		const { username, password } = form;
		try {
			await Auth.signIn(username, password);
			navigation.navigate('Home');
		} catch (e) {
			if (e.code === 'UserNotConfirmedException') {
				navigation.navigate('SignUp', { username });
			} else {
				Alert.alert('Error!', e.message || 'An error occurred.');
			}
		}

		setLoading(false);
	};

	// TODO: Font is currently not case sensitive - fix this
	return (
		<GradientBackground>
			<ScrollView contentContainerStyle={styles.container}>
				<TextInput
					value={form.username}
					onChangeText={(value) => setFormInput('username', value)}
					returnKeyType="next"
					placeholder="Username"
					style={{ marginBottom: 20 }}
					onSubmitEditing={() => passwordRef.current?.focus()}
				/>
				<TextInput
					value={form.password}
					onChangeText={(value) => setFormInput('password', value)}
					ref={passwordRef}
					returnKeyType="done"
					placeholder="Password"
					style={{ marginBottom: 30 }}
					secureTextEntry
				/>
				<TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
					<Text style={styles.forgotPasswordLink}>Forgot Password</Text>
				</TouchableOpacity>
				<Button text="Login" onPress={login} loading={loading} />
				<TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
					<Text style={styles.registerLink}>Don&apos;t have an account?</Text>
				</TouchableOpacity>
			</ScrollView>
		</GradientBackground>
	);
}
