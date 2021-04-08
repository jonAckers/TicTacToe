import React, { ReactElement } from 'react';
import { ScrollView, TouchableOpacity, View, Switch } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';

import styles from './settings.styles';
import { GradientBackground, Text } from '@components';
import { colors } from '@utils';
import { difficulties, useSettings } from '@contexts/settings';
import { StackNavigatorParams } from '@config/navigator';
import { useAuth } from '@contexts/auth';

type SettingsScreenNavigationProp = StackNavigationProp<StackNavigatorParams, 'Settings'>;

type SettingsProps = {
	navigation: SettingsScreenNavigationProp;
};

export default function Settings({ navigation }: SettingsProps): ReactElement | null {
	const { settings, saveSetting } = useSettings();
	const { user } = useAuth();

	if (!settings) {
		return null;
	}

	return (
		<GradientBackground>
			<ScrollView contentContainerStyle={styles.container}>
				<View style={styles.field}>
					<Text style={styles.label}>AI Difficulty</Text>
					<View style={styles.choices}>
						{Object.keys(difficulties).map((level) => {
							return (
								<TouchableOpacity
									key={level}
									style={[
										styles.choice,
										{
											backgroundColor:
												settings.difficulty === level
													? colors.lightPurple
													: colors.lightGreen,
										},
									]}
									onPress={() =>
										saveSetting(
											'difficulty',
											level as keyof typeof difficulties
										)
									}
								>
									<Text
										style={[
											styles.choiceText,
											{
												color:
													settings.difficulty === level
														? colors.lightGreen
														: colors.darkPurple,
											},
										]}
									>
										{difficulties[level as keyof typeof difficulties]}
									</Text>
								</TouchableOpacity>
							);
						})}
					</View>
				</View>
				<View style={[styles.field, styles.switchField]}>
					<Text style={styles.label}>Sounds</Text>
					<Switch
						value={settings.sounds}
						trackColor={{ false: colors.purple, true: colors.lightPurple }}
						ios_backgroundColor={colors.purple}
						thumbColor={colors.lightGreen}
						onValueChange={() => saveSetting('sounds', !settings.sounds)}
					/>
				</View>
				<View style={[styles.field, styles.switchField]}>
					<Text style={styles.label}>Vibrations</Text>
					<Switch
						value={settings.haptics}
						trackColor={{ false: colors.purple, true: colors.lightPurple }}
						ios_backgroundColor={colors.purple}
						thumbColor={colors.lightGreen}
						onValueChange={() => saveSetting('haptics', !settings.haptics)}
					/>
				</View>
				{user && (
					<View style={[styles.field, styles.switchField]}>
						<TouchableOpacity
							onPress={() => {
								navigation.navigate('ChangePassword');
							}}
						>
							<Text style={[styles.label, { textDecorationLine: 'underline' }]}>
								Change Password
							</Text>
						</TouchableOpacity>
					</View>
				)}
			</ScrollView>
		</GradientBackground>
	);
}
