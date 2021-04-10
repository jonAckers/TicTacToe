/* Amplify Params - DO NOT EDIT
	API_TICTACTOE_GRAPHQLAPIENDPOINTOUTPUT
	API_TICTACTOE_GRAPHQLAPIIDOUTPUT
	API_TICTACTOE_GRAPHQLAPIKEYOUTPUT
	ENV
	REGION
Amplify Params - DO NOT EDIT */
const appsync = require('aws-appsync');
const gql = require('graphql-tag');
require('cross-fetch/polyfill');

const isTerminal = require('./isTerminal');

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

	const player = event.identity.username;
	const gameId = event.arguments.game;
	const index = event.arguments.index;

	// 1. Get game object using the id and make sure it exists
	const gameQuery = gql`
		query getGame($id: ID!) {
			getGame(id: $id) {
				id
				turn
				state
				status
				winner
				owners
				initiator
			}
		}
	`;

	const gameResponse = await graphqlClient.query({
		query: gameQuery,
		variables: {
			id: gameId,
		},
	});

	const game = gameResponse.data.getGame;
	if (!game) {
		throw new Error('Game not found!');
	}

	// 2. Make sure the game is active
	if (game.status !== 'REQUESTED' && game.status !== 'ACTIVE') {
		throw new Error('Game is not active!');
	}

	// 3. Check that the current user is a participant and it's their turn]
	if (!game.owners.includes(player)) {
		throw new Error('The current user is not a player in this game!');
	}

	if (game.turn !== player) {
		throw new Error("It's not your turn!");
	}

	// 4. Make sure that the index is valid (between 0 and 8 and not already occupied)
	if (index > 8 || game.state[index]) {
		throw new Error("You can't play there!");
	}

	// 5. Update the state, check if move is a terminal one, and update the winner, status, turn, and state
	const symbol = player === game.initiator ? 'x' : 'o';
	const nextTurn = game.owners.find((p) => p !== game.turn);
	const invitee = game.owners.find((p) => p !== game.initiator);
	const newState = [...game.state];

	newState[index] = symbol;

	let newStatus = 'ACTIVE';
	let newWinner = null;

	const terminalState = isTerminal(newState);
	if (terminalState) {
		newStatus = 'FINISHED';

		if (terminalState.winner === 'x') {
			newWinner = game.initiator;
		} else if (terminalState === 'o') {
			newWinner = invitee;
		}
	}

	const gameMutation = gql`
		mutation updateGame(
			$id: ID!
			$turn: String!
			$winner: String
			$status: GameStatus!
			$state: [Symbol]!
			$player: String!
		) {
			updateGame(
				input: { id: $id, turn: $turn, winner: $winner, status: $status, state: $state }
				condition: { turn: { eq: $player } }
			) {
				id
				turn
				state
				status
				winner
			}
		}
	`;

	const gameMutationResponse = graphqlClient.mutate({
		mutation: gameMutation,
		variables: {
			id: gameId,
			turn: nextTurn,
			winner: newWinner,
			status: newStatus,
			state: newState,
			player: player,
		},
	});

	// 6. Return updated game
	return gameMutationResponse.data.updateGame;
};
