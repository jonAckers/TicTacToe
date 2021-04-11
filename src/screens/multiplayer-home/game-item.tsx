import React, { ReactElement, useEffect, useRef, useState } from 'react';
import { Animated, TouchableOpacity } from 'react-native';
import { API, graphqlOperation } from 'aws-amplify';
import Observable from 'zen-observable';

import styles from './multiplayer-home.styles';
import { PlayerGameType } from './multiplayer-home.graphql';
import { Text } from '@components';
import { useAuth } from '@contexts/auth';
import { colors, onUpdateGameById } from '@utils';

type GameItemProps = {
	playerGame: PlayerGameType;
	onPress: () => void;
};

export default function GameItem({
	playerGame: playerGameProp,
	onPress,
}: GameItemProps): ReactElement | null {
	const { user } = useAuth();
	const [playerGame, setPlayerGame] = useState<PlayerGameType>(playerGameProp);
	const animationRef = useRef<Animated.Value>(new Animated.Value(0));

	if (!user) {
		return null;
	}

	const game = playerGame?.game;
	const opponent = game?.players?.items?.find(
		(playerGame) => playerGame?.player.username !== user.username
	);

	const getResult = (playerGame: PlayerGameType): 'win' | 'lose' | 'draw' | null => {
		if (!playerGame || !user) {
			return null;
		}

		const game = playerGame.game;
		if (game.status !== 'FINISHED') {
			return null;
		}

		if (game.winner === user.username) {
			return 'win';
		} else if (game.winner === opponent?.player.username) {
			return 'lose';
		} else if (game.winner === null) {
			return 'draw';
		}

		return null;
	};

	const result = getResult(playerGame);

	useEffect(() => {
		if (game && (game.status === 'REQUESTED' || game.status === 'ACTIVE')) {
			const gameUpdates = (API.graphql(
				graphqlOperation(onUpdateGameById, { id: game.id })
			) as unknown) as Observable<{ [key: string]: any }>;

			const subscription = gameUpdates.subscribe({
				next: ({ value }) => {
					const newGame = value.data.onUpdateGameById;
					if (newGame && playerGame) {
						setPlayerGame({ ...playerGame, game: { ...playerGame.game, ...newGame } });
					}
					if (newGame.status === ' FINISHED') {
						subscription.unsubscribe();
					}
					Animated.sequence([
						Animated.timing(animationRef.current, {
							toValue: 1,
							duration: 500,
							useNativeDriver: false,
						}),
						Animated.delay(1000),
						Animated.timing(animationRef.current, {
							toValue: 0,
							duration: 500,
							useNativeDriver: false,
						}),
					]).start();
				},
			});

			return () => subscription.unsubscribe();
		}
	}, []);

	return (
		<TouchableOpacity onPress={onPress} style={styles.item}>
			<Animated.View
				style={[
					styles.itemBackground,
					{
						backgroundColor: animationRef.current.interpolate({
							inputRange: [0, 1],
							outputRange: [colors.purple, colors.lightPurple],
						}),
					},
				]}
			/>
			<Text style={styles.itemTitle}>
				{opponent?.player.name} ({opponent?.player.username})
			</Text>
			{(game?.status === 'REQUESTED' || game?.status === 'ACTIVE') && (
				<Text style={{ color: colors.lightGreen, textAlign: 'center' }}>
					{game.turn === user.username
						? 'Your Turn!'
						: `Waiting for ${opponent?.player.username}`}
				</Text>
			)}
			{result && (
				<Text style={{ color: colors[result], textAlign: 'center' }}>
					{result === 'win' && 'You Won!'}
					{result === 'lose' && 'You Lost!'}
					{result === 'draw' && "It's a draw!"}
				</Text>
			)}
		</TouchableOpacity>
	);
}
