import React, { ReactElement } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppBootstrap, Text } from '@components';

export default function App(): ReactElement {
	return (
		<AppBootstrap>
			<View style={styles.container}>
				<Text onPress={() => alert('clicked')} style={{ fontSize: 25 }}>
					First Level <Text weight="400">Second Level</Text>
				</Text>
			</View>
		</AppBootstrap>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
		alignItems: 'center',
		justifyContent: 'center',
	},
});
