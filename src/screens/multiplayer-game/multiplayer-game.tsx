import React, { ReactElement, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Dimensions, SafeAreaView, View } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/core';
import { API, graphqlOperation } from 'aws-amplify';
import { GraphQLResult } from '@aws-amplify/api';
import { getGameQuery, startGameMutation, playMoveMutation } from '@api';
import Observable from 'zen-observable';

import styles from './multiplayer-game.styles';
import { Board, Button, GradientBackground, Text } from '@components';
import { StackNavigatorParams } from '@config/navigator';
import { getGame, startGame, playMove } from './multiplayer-game.graphql';
import {
	BoardState,
	colors,
	Move,
	getErrorMessage,
	onUpdateGameById,
	isTerminal,
	useSounds,
	showAd,
} from '@utils';
import { useAuth } from '@contexts/auth';

const SCREEN_WIDTH = Dimensions.get('screen').width;

type GameType = getGameQuery['getGame'];

type MultiplayerGameScreenNavigationProp = StackNavigationProp<
	StackNavigatorParams,
	'MultiplayerGame'
>;
type MultiplayerGameScreenRouteProp = RouteProp<StackNavigatorParams, 'MultiplayerGame'>;

type MultiplayerGameProps = {
	navigation: MultiplayerGameScreenNavigationProp;
	route: MultiplayerGameScreenRouteProp;
};

export default function MultiplayerGame({ navigation, route }: MultiplayerGameProps): ReactElement {
	const { gameId: existingGameId, invitee } = route.params;
	const { user } = useAuth();

	const [gameId, setGameId] = useState<string | null>(null);
	const [game, setGame] = useState<GameType | null>(null);
	const [loading, setLoading] = useState(false);
	const [chosenCell, setChosenCell] = useState<Move | null>(null);
	const [finished, setFinished] = useState(false);

	const gameResult = game ? isTerminal(game.state as BoardState) : false;
	const playSound = useSounds();
	const opponent =
		game?.players?.items &&
		user &&
		game.players.items.find((p) => p?.player.username !== user.username);

	const isActive = () => {
		return game && (game.status === 'ACTIVE' || game.status === 'REQUESTED');
	};

	const initGame = async () => {
		setLoading(true);
		let gameId = existingGameId;
		try {
			if (!gameId) {
				const startGameResponse = (await API.graphql(
					graphqlOperation(startGame, { invitee })
				)) as GraphQLResult<startGameMutation>;

				if (startGameResponse.data?.startGame) {
					gameId = startGameResponse.data.startGame.id;
				}
			}

			if (gameId) {
				const getGameResponse = (await API.graphql(
					graphqlOperation(getGame, { id: gameId })
				)) as GraphQLResult<getGameQuery>;

				if (getGameResponse.data?.getGame) {
					if (getGameResponse.data.getGame.status === 'FINISHED') {
						setFinished(true);
					}
					setGame(getGameResponse.data?.getGame);
					setGameId(gameId);
				}
			}
		} catch (e) {
			Alert.alert('Error!', getErrorMessage(e));
		}
		setLoading(false);
	};

	const makeMove = async (index: Move) => {
		setChosenCell(index);
		try {
			const playMoveResponse = (await API.graphql(
				graphqlOperation(playMove, { index, game: gameId })
			)) as GraphQLResult<playMoveMutation>;

			if (game && playMoveResponse.data?.playMove) {
				const { status, state, winner, turn } = playMoveResponse.data.playMove;
				setGame({ ...game, status, state, winner, turn });
			}
		} catch (e) {
			Alert.alert('Error!', getErrorMessage(e));
		}
		setChosenCell(null);
	};

	useEffect(() => {
		if (game && (game.status === 'REQUESTED' || game.status === 'ACTIVE')) {
			const gameUpdates = (API.graphql(
				graphqlOperation(onUpdateGameById, {
					id: gameId,
				})
			) as unknown) as Observable<{ [key: string]: any }>;

			const subscription = gameUpdates.subscribe({
				next: ({ value }) => {
					const newGame = value.data.onUpdateGameById;
					if (newGame && game) {
						const { status, state, winner, turn } = newGame;
						setGame({ ...game, status, state, winner, turn });
						if (user) {
							user.username === turn ? playSound('pop1') : playSound('pop2');
						}
					}
				},
			});

			return () => subscription.unsubscribe();
		}
	}, [gameId]);

	useEffect(() => {
		if (game && game.status === 'FINISHED' && !finished) {
			if (game.winner === null) {
				playSound('draw');
			} else if (user && game.winner === user.username) {
				playSound('win');
			} else {
				playSound('lose');
			}

			showAd();
		}
	}, [game]);

	useEffect(() => {
		initGame();
	}, []);

	return (
		<GradientBackground>
			<SafeAreaView style={styles.container}>
				{loading && (
					<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
						<ActivityIndicator color={colors.lightGreen} />
					</View>
				)}
				{game && user && (
					<>
						<View style={{ width: SCREEN_WIDTH - 60 }}>
							<Text style={styles.turn} numberOfLines={1}>
								{game.turn === user?.username && isActive() && 'Your Turn'}
								{game.turn === opponent?.player.username &&
									isActive() &&
									`Waiting for ${opponent?.player.username}`}
								{!isActive() && 'Game Over'}
							</Text>
							<View style={styles.gameInfo}>
								<View
									style={[
										styles.player,
										game.turn === user?.username &&
											isActive() &&
											styles.playerTurn,
										{ alignItems: 'flex-end' },
									]}
								>
									<Text style={styles.playerName} numberOfLines={1}>
										{user?.attributes.name}
									</Text>
									<Text
										weight="400"
										style={styles.playerUsername}
										numberOfLines={1}
									>
										{user?.username}
									</Text>
								</View>
								<View style={styles.vs}>
									<Text style={styles.vsText}>VS</Text>
								</View>
								<View
									style={[
										styles.player,
										game.turn === opponent?.player.username &&
											isActive() &&
											styles.playerTurn,
									]}
								>
									<Text style={styles.playerName} numberOfLines={1}>
										{opponent?.player.name}
									</Text>
									<Text
										weight="400"
										style={styles.playerUsername}
										numberOfLines={1}
									>
										{opponent?.player.username}
									</Text>
								</View>
							</View>
						</View>
						<Board
							size={SCREEN_WIDTH - 60}
							state={game.state as BoardState}
							gameResult={gameResult}
							disabled={
								game.turn !== user.username ||
								chosenCell !== null ||
								game.status === 'FINISHED'
							}
							loading={chosenCell}
							onCellPressed={(index) => {
								makeMove(index as Move);
							}}
						/>
					</>
				)}
				{game && user && game.status === 'FINISHED' && (
					<View style={styles.modal}>
						<Text style={styles.modalText}>
							{game.winner === user.username && 'You Win!'}
							{game.winner === opponent?.player.username && 'You Lose!'}
							{game.winner === null && "It's a draw!"}
						</Text>
						<Button
							onPress={() => {
								if (opponent?.player.username) {
									navigation.replace('MultiplayerGame', {
										invitee: opponent?.player.username,
									});
								}
							}}
							text="Play Again?"
						/>
					</View>
				)}
			</SafeAreaView>
		</GradientBackground>
	);
}
