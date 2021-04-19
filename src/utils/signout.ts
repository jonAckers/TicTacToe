import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import { Auth, API, graphqlOperation } from 'aws-amplify';
import gql from 'graphql-tag';

const signOut = async (): Promise<void> => {
	if (Constants.isDevice) {
		const tokenResponse = await Notifications.getExpoPushTokenAsync();

		const deleteExpoToken = gql`
			mutation deleteExpoToken($token: String!) {
				deleteExpoToken(input: { token: $token }) {
					token
				}
			}
		`;

		/*
        TODO: This currently doesn't work. I think it's an issue with the schema being auto generated
		await API.graphql(
			graphqlOperation(deleteExpoToken, {
				token: tokenResponse.data,
			})
		);
        */
	}
	await Auth.signOut();
};

export default signOut;
