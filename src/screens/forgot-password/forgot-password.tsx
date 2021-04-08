import React, { ReactElement, useRef, useState } from 'react';
import { StackNavigationProp, useHeaderHeight } from '@react-navigation/stack';
import { Alert, KeyboardAvoidingView, Platform, TextInput as NativeTextInput } from 'react-native';
import { Auth } from 'aws-amplify';

import styles from './forgot-password.styles';
import { StackNavigatorParams } from '@config/navigator';
import { Button, GradientBackground, TextInput } from '@components';
import { ScrollView } from 'react-native-gesture-handler';

type ForgotPasswordScreenNavigationProp = StackNavigationProp<
	StackNavigatorParams,
	'ForgotPassword'
>;

type ForgotPasswordProps = {
	navigation: ForgotPasswordScreenNavigationProp;
};

export default function ForgotPassword({ navigation }: ForgotPasswordProps): ReactElement {
	const headerHeight = useHeaderHeight();

	const passwordRef = useRef<NativeTextInput | null>(null);

	const [loading, setLoading] = useState(false);
	const [step, setStep] = useState<'1' | '2'>('1');
	const [form, setForm] = useState({ username: '', password: '', code: '' });

	const setFormInput = (key: keyof typeof form, value: string) => {
		setForm({ ...form, [key]: value });
	};

	const forgotPassword = async () => {
		const { username } = form;
		setLoading(true);
		try {
			await Auth.forgotPassword(username);
			setStep('2');
		} catch (e) {
			Alert.alert('Error!', e.message || 'An error occurred.');
		}
		setLoading(false);
	};

	const forgotPasswordSubmit = async () => {
		const { username, code, password } = form;
		setLoading(true);
		try {
			await Auth.forgotPasswordSubmit(username, code, password);
			navigation.navigate('Login');
		} catch (e) {
			Alert.alert('Error!', e.message || 'An error occurred.');
		}
		setLoading(false);
	};

	return (
		<GradientBackground>
			<KeyboardAvoidingView
				behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
				keyboardVerticalOffset={headerHeight}
				style={{ flex: 1 }}
			>
				<ScrollView contentContainerStyle={styles.container}>
					{step === '1' ? (
						<TextInput
							returnKeyType="next"
							style={{ marginBottom: 20 }}
							placeholder="Username"
							value={form.username}
							onChangeText={(value) => setFormInput('username', value)}
						/>
					) : (
						<>
							<TextInput
								returnKeyType="next"
								keyboardType="numeric"
								style={{ marginBottom: 20 }}
								placeholder="Verification Code"
								value={form.code}
								onChangeText={(value) => setFormInput('code', value)}
								onSubmitEditing={() => {
									passwordRef.current?.focus();
								}}
							/>
							<TextInput
								secureTextEntry
								returnKeyType="done"
								style={{ marginBottom: 20 }}
								ref={passwordRef}
								placeholder="New Password"
								value={form.password}
								onChangeText={(value) => setFormInput('password', value)}
							/>
						</>
					)}
					<Button
						text="Submit"
						style={{ marginTop: 10 }}
						loading={loading}
						onPress={() => {
							if (step === '1') {
								forgotPassword();
							}
							if (step === '2') {
								forgotPasswordSubmit();
							}
						}}
					/>
				</ScrollView>
			</KeyboardAvoidingView>
		</GradientBackground>
	);
}
