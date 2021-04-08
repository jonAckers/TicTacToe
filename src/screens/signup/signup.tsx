import React, { ReactElement, useEffect, useRef, useState } from 'react';
import {
	ActivityIndicator,
	Alert,
	ScrollView,
	TextInput as NativeTextInput,
	KeyboardAvoidingView,
	Platform,
	TouchableOpacity,
} from 'react-native';
import { Auth } from 'aws-amplify';
import OTPInput from '@twotalltotems/react-native-otp-input';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp, useHeaderHeight } from '@react-navigation/stack';

import styles from './signup.styles';
import { Button, GradientBackground, TextInput, Text } from '@components';
import { StackNavigatorParams } from '@config/navigator';
import { colors } from '@utils';

type SignUpProps = {
	navigation: StackNavigationProp<StackNavigatorParams, 'SignUp'>;
	route: RouteProp<StackNavigatorParams, 'SignUp'>;
};

export default function SignUp({ navigation, route }: SignUpProps): ReactElement {
	const unconfirmedUsername = route.params?.username;

	const headerHeight = useHeaderHeight();

	const nameRef = useRef<NativeTextInput | null>(null);
	const emailRef = useRef<NativeTextInput | null>(null);
	const passwordRef = useRef<NativeTextInput | null>(null);

	const [form, setForm] = useState({
		username: 'test1',
		name: 'Test Name',
		email: 'kailash@cbrolleru.com',
		password: 'password',
	});
	const [loading, setLoading] = useState(false);
	const [step, setStep] = useState<'signUp' | 'otp'>(unconfirmedUsername ? 'otp' : 'signUp');
	const [confirming, setConfirming] = useState(false);
	const [resending, setResending] = useState(false);

	const setFormInput = (key: keyof typeof form, value: string) => {
		setForm({ ...form, [key]: value });
	};

	const signUp = async () => {
		setLoading(true);

		const { username, name, email, password } = form;
		try {
			await Auth.signUp({
				username,
				password,
				attributes: {
					name,
					email,
				},
			});
			setStep('otp');
		} catch (e) {
			Alert.alert('Error!', e.message || 'An error occurred.');
		}

		setLoading(false);
	};

	const confirmCode = async (code: string) => {
		setConfirming(true);
		try {
			await Auth.confirmSignUp(unconfirmedUsername || form.username, code);
			navigation.navigate('Login');
		} catch (e) {
			Alert.alert('Error!', e.message || 'An error occurred.');
		}
		setConfirming(false);
	};

	const resendCode = async (username: string) => {
		setResending(true);
		try {
			await Auth.resendSignUp(unconfirmedUsername || username);
		} catch (e) {
			Alert.alert('Error!', e.message || 'An error occurred.');
		}
		setResending(false);
	};

	useEffect(() => {
		if (unconfirmedUsername) {
			resendCode(unconfirmedUsername);
		}
	}, []);

	// TODO: Font is currently not case sensitive - fix this
	return (
		<GradientBackground>
			<KeyboardAvoidingView
				keyboardVerticalOffset={headerHeight}
				behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
				style={{ flex: 1 }}
			>
				<ScrollView contentContainerStyle={styles.container}>
					{step === 'otp' ? (
						<>
							<Text style={styles.otpText}>
								Enter the code that you received via email...
							</Text>

							{confirming ? (
								<ActivityIndicator color={colors.lightGreen} />
							) : (
								<>
									<OTPInput
										style={{ height: 100 }}
										placeholderCharacter="0"
										placeholderTextColor="#5d5379"
										pinCount={6}
										codeInputFieldStyle={styles.otpInputBox}
										codeInputHighlightStyle={styles.otpActiveInputBox}
										onCodeFilled={(code) => {
											confirmCode(code);
										}}
									/>
									{resending ? (
										<ActivityIndicator color={colors.lightGreen} />
									) : (
										<TouchableOpacity onPress={() => resendCode(form.username)}>
											<Text style={styles.resendLink}>Resend Code</Text>
										</TouchableOpacity>
									)}
								</>
							)}
						</>
					) : (
						<>
							<TextInput
								value={form.username}
								onChangeText={(value) => setFormInput('username', value)}
								returnKeyType="next"
								placeholder="Username"
								style={{ marginBottom: 20 }}
								onSubmitEditing={() => nameRef.current?.focus()}
							/>
							<TextInput
								value={form.name}
								onChangeText={(value) => setFormInput('name', value)}
								ref={nameRef}
								returnKeyType="next"
								placeholder="Name"
								style={{ marginBottom: 20 }}
								onSubmitEditing={() => emailRef.current?.focus()}
							/>
							<TextInput
								value={form.email}
								onChangeText={(value) => setFormInput('email', value)}
								ref={emailRef}
								keyboardType="email-address"
								returnKeyType="next"
								placeholder="Email"
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
							<Button text="Sign Up" onPress={signUp} loading={loading} />
						</>
					)}
				</ScrollView>
			</KeyboardAvoidingView>
		</GradientBackground>
	);
}
