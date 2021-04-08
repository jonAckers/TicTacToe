import React, { ReactElement } from 'react';
import Amplify from 'aws-amplify';
import config from '../aws-exports';

import { AppBootstrap } from '@components';
import Navigator from '@config/navigator';
import { AuthProvider } from '@contexts/auth';
import { SettingsProvider } from '@contexts/settings';

Amplify.configure(config);

export default function App(): ReactElement {
	return (
		<AuthProvider>
			<AppBootstrap>
				<SettingsProvider>
					<Navigator />
				</SettingsProvider>
			</AppBootstrap>
		</AuthProvider>
	);
}
