import { useEffect, useRef } from 'react';
import { Audio } from 'expo-av';
import * as Haptics from 'expo-haptics';
import { useSettings } from '@contexts/settings';

type SoundType = 'pop1' | 'pop2' | 'win' | 'lose' | 'draw';

export default function useSounds(): (sound: SoundType) => void {
	const { settings } = useSettings();
	const pop1SoundRef = useRef<Audio.Sound | null>(null);
	const pop2SoundRef = useRef<Audio.Sound | null>(null);
	const winSoundRef = useRef<Audio.Sound | null>(null);
	const loseSoundRef = useRef<Audio.Sound | null>(null);
	const drawSoundRef = useRef<Audio.Sound | null>(null);

	const lightVibrate = Haptics.ImpactFeedbackStyle.Light;
	const winVibrate = Haptics.NotificationFeedbackType.Success;
	const loseVibrate = Haptics.NotificationFeedbackType.Error;
	const drawVibrate = Haptics.NotificationFeedbackType.Warning;

	const soundsMap = {
		pop1: pop1SoundRef,
		pop2: pop2SoundRef,
		win: winSoundRef,
		lose: loseSoundRef,
		draw: drawSoundRef,
	};

	const playSound = async (sound: SoundType): Promise<void> => {
		try {
			const status = await soundsMap[sound].current?.getStatusAsync();
			status &&
				status.isLoaded &&
				settings?.sounds &&
				soundsMap[sound].current?.replayAsync();

			if (settings?.haptics) {
				switch (sound) {
					case 'pop1':
					case 'pop2':
						Haptics.impactAsync(lightVibrate);
						break;
					case 'win':
						Haptics.notificationAsync(winVibrate);
						break;
					case 'lose':
						Haptics.notificationAsync(loseVibrate);
						break;
					case 'draw':
						Haptics.notificationAsync(drawVibrate);
						break;
					default:
						break;
				}
			}
		} catch (e) {
			return;
		}
	};

	useEffect(() => {
		// Load sounds
		const loadSounds = async () => {
			/* eslint-disable @typescript-eslint/no-var-requires */
			const pop1Sound = await Audio.Sound.createAsync(require('@assets/pop_1.wav'));
			pop1SoundRef.current = pop1Sound.sound;

			const pop2Sound = await Audio.Sound.createAsync(require('@assets/pop_2.wav'));
			pop2SoundRef.current = pop2Sound.sound;

			const winSound = await Audio.Sound.createAsync(require('@assets/win.mp3'));
			winSoundRef.current = winSound.sound;

			const loseSound = await Audio.Sound.createAsync(require('@assets/lose.mp3'));
			loseSoundRef.current = loseSound.sound;

			const drawSound = await Audio.Sound.createAsync(require('@assets/draw.mp3'));
			drawSoundRef.current = drawSound.sound;
		};

		loadSounds();

		return () => {
			// Unload sounds
			pop1SoundRef.current?.unloadAsync();
			pop2SoundRef.current?.unloadAsync();
			winSoundRef.current?.unloadAsync();
			loseSoundRef.current?.unloadAsync();
			drawSoundRef.current?.unloadAsync();
		};
	}, []);

	return playSound;
}
