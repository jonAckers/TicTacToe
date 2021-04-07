import React, {
	createContext,
	ReactElement,
	ReactNode,
	useContext,
	useEffect,
	useState,
} from 'react';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const difficulties = {
	'1': 'Easy',
	'3': 'Medium',
	'4': 'Hard',
	'-1': 'Impossible',
};

type SettingsType = {
	difficulty: keyof typeof difficulties;
	sounds: boolean;
	haptics: boolean;
};

type SettingsContextType = {
	settings: SettingsType | null;
	saveSetting: <T extends keyof SettingsType>(settings: T, value: SettingsType[T]) => void;
	loadSettings: () => void;
};

const defaultSettings: SettingsType = {
	difficulty: '3',
	sounds: true,
	haptics: true,
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

function useSettings(): SettingsContextType {
	const context = useContext(SettingsContext);
	if (!context) {
		throw new Error('useSettings must be used within a SettingsProvider.');
	}
	return context;
}

function SettingsProvider(props: { children: ReactNode }): ReactElement {
	const [settings, setSettings] = useState<SettingsType | null>(null);

	const saveSetting = async <T extends keyof SettingsType>(
		setting: T,
		value: SettingsType[T]
	) => {
		try {
			const oldSettings = settings ? settings : defaultSettings;
			const newSettings = { ...oldSettings, [setting]: value };

			await AsyncStorage.setItem('@settings', JSON.stringify(newSettings));
			setSettings(newSettings);
		} catch {
			Alert.alert('Error!', 'An error has occurred. Cannot save settings.');
		}
	};

	const loadSettings = async () => {
		try {
			const settings = await AsyncStorage.getItem('@settings');
			settings ? setSettings(JSON.parse(settings)) : setSettings(defaultSettings);
		} catch (e) {
			setSettings(defaultSettings);
		}
	};

	useEffect(() => {
		loadSettings();
	}, []);

	return (
		<SettingsContext.Provider
			{...props}
			value={{
				settings,
				saveSetting,
				loadSettings,
			}}
		/>
	);
}

export { difficulties, useSettings, SettingsProvider };
