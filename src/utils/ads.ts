import { Platform } from 'react-native';
import { AdMobInterstitial, setTestDeviceIDAsync } from 'expo-ads-admob';
import Constants from 'expo-constants';

setTestDeviceIDAsync('EMULATOR');

const adUnitId = Platform.select({
	ios:
		Constants.isDevice && !__DEV__
			? 'ca-app-pub-3644823313612711/3971108755'
			: 'ca-app-pub-3940256099942544/4411468910',
	android:
		Constants.isDevice && !__DEV__
			? 'ca-app-pub-3644823313612711/5092618737'
			: 'ca-app-pub-3940256099942544/1033173712',
});

const showAd = async () => {
	if (!adUnitId) {
		return;
	}
	try {
		await AdMobInterstitial.setAdUnitID(adUnitId);
		await AdMobInterstitial.requestAdAsync({ servePersonalizedAds: true });
		await AdMobInterstitial.showAdAsync();
	} catch (e) {
		return;
	}
};

export default showAd;
