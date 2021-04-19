/* Amplify Params - DO NOT EDIT
	API_TICTACTOE_GRAPHQLAPIENDPOINTOUTPUT
	API_TICTACTOE_GRAPHQLAPIIDOUTPUT
	API_TICTACTOE_GRAPHQLAPIKEYOUTPUT
	ENV
	REGION
Amplify Params - DO NOT EDIT */
const appsync = require('aws-appsync');
const gql = require('graphql-tag');
const { Expo } = require('expo-server-sdk');
const { deleteExpoToken } = require('src/graphql/mutations');
require('cross-fetch/polyfill');

exports.handler = async (event) => {
	const graphqlClient = new appsync.AWSAppSyncClient({
		url: process.env.API_TICTACTOE_GRAPHQLAPIENDPOINTOUTPUT,
		region: process.env.REGION,
		auth: {
			type: 'AWS_IAM',
			credentials: {
				accessKeyId: process.env.AWS_ACCESS_KEY_ID,
				secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
				sessionToken: process.env.AWS_SESSION_TOKEN,
			},
		},
		disableOffline: true,
	});

	const ticketsQuery = gql`
		query listExpoTicketsObjects {
			listExpoTicketsObjects {
				items {
					tickets
					id
					createdAt
				}
			}
		}
	`;

	const ticketsResponse = await graphql.query({
		query: ticketsQuery,
	});

	const ticketsObjects = ticketsResponse.data.listExpoTicketsObjects.items;
	for (const ticketsObj of ticketsObjects) {
		const currentDate = new Date();
		const ticketsObjDate = new Date(ticketsObj.createdAt);
		const timeDiff = (currentDate.getTime() - ticketsObjDate.getTime()) / (1000 * 60 * 60);
		if (timeDiff < 1) {
			continue;
		}

		const tickets = JSON.parse(ticketsObj.tickets);
		const expo = new Expo();
		const receiptIdChunks = expo.chunkPushNotificationReceiptIds(Object.keys(tickets));

		for (const chunk of receiptIdChunks) {
			try {
				const receipts = await expo.getPushNotificationReceiptsAsync(chunk);

				for (let receiptId in receipts) {
					const { status, details } = receipts[receiptId];
					if (status === 'error') {
						if (details && details.error && details.error === 'DeviceNotRegistered') {
							const deleteExpoToken = gql`
								mutation deleteExpoToken($token: String!) {
									deleteExpoToken(input: { token: $token }) {
										token
									}
								}
							`;
							/* TODO: fix delete mutation
							try {
								await graphqlClient.mutate({
									mutation: deleteExpoToken,
									variables: {
										token: tickets[receiptId],
									},
								});
							} catch (e) {
								return;
							}
                            */
						}
					}
				}
			} catch (e) {
				return;
			}
		}
		const deleteExpoTicketObject = gql`
			mutation deleteExpoTicketObject($id: ID!) {
				deleteExpoTicketObject(input: { id: $id }) {
					id
				}
			}
		`;

		try {
			await graphqlClient.mutate({
				mutation: deleteExpoTicketObject,
				variables: {
					id: ticketsObj.id,
				},
			});
		} catch (e) {
			return;
		}
	}
};
