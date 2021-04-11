import React, { ReactElement, useEffect, useState } from 'react';
import {
	ActivityIndicator,
	Alert,
	FlatList,
	RefreshControl,
	TouchableOpacity,
	View,
} from 'react-native';
import { API, graphqlOperation } from 'aws-amplify';
import { GraphQLResult } from '@aws-amplify/api';
import { GetPlayerQuery } from '@api';
import Modal from 'react-native-modal';
import { StackNavigationProp } from '@react-navigation/stack';
import { StackNavigatorParams } from '@config/navigator';

import styles from './multiplayer-home.styles';
import { getPlayer, PlayerGameType } from './multiplayer-home.graphql';
import { Button, GradientBackground, Text } from '@components';
import { useAuth } from '@contexts/auth';
import { colors } from '@utils';
import GameItem from './game-item';
import PlayersModal from './players-modal/players-modal';

type MultiplayerHomeScreenNavigationProps = StackNavigationProp<
	StackNavigatorParams,
	'MultiplayerHome'
>;

type MultiplayerHomeProps = {
	navigation: MultiplayerHomeScreenNavigationProps;
};

export default function MultiplayerHome({ navigation }: MultiplayerHomeProps): ReactElement {
	const { user } = useAuth();

	const [playerGames, setPlayerGames] = useState<PlayerGameType[] | null>(null);
	const [nextToken, setNextToken] = useState<string | null | undefined>(null);
	const [loading, setLoading] = useState(false);
	const [refreshing, setRefreshing] = useState(false);
	const [playersModal, setPlayersModal] = useState(false);

	useEffect(() => {
		fetchPlayer(null, true);
	}, []);

	const fetchPlayer = async (nextToken: string | null, init = false) => {
		if (user) {
			setLoading(true);
			if (!nextToken && !init) {
				setRefreshing(true);
			}
			try {
				const player = (await API.graphql(
					graphqlOperation(getPlayer, {
						username: user.username,
						limit: 10,
						sortDirection: 'DESC',
						nextToken: nextToken,
					})
				)) as GraphQLResult<GetPlayerQuery>;

				if (player.data?.getPlayer?.games) {
					const newPlayerGames = player.data.getPlayer.games.items || [];
					setPlayerGames(
						!playerGames || !nextToken
							? newPlayerGames
							: [...playerGames, ...newPlayerGames]
					);
					setNextToken(player.data.getPlayer.games.nextToken);
				}
			} catch (e) {
				Alert.alert('Error!', 'An error has occurred.');
			}
			setLoading(false);
			setRefreshing(false);
		}
	};

	return (
		<GradientBackground>
			{user ? (
				<>
					<FlatList
						contentContainerStyle={styles.container}
						data={playerGames}
						renderItem={({ item }) => (
							<GameItem
								onPress={() => {
									if (item?.game) {
										navigation.navigate('MultiplayerGame', {
											gameId: item.game.id,
										});
									}
								}}
								playerGame={item}
							/>
						)}
						refreshControl={
							<RefreshControl
								refreshing={refreshing}
								onRefresh={() => fetchPlayer(null)}
								tintColor={colors.lightGreen}
							/>
						}
						keyExtractor={(playerGame) =>
							playerGame ? playerGame.game.id : `${new Date().getTime()}`
						}
						ListEmptyComponent={() => {
							if (loading) {
								return (
									<View style={styles.loading}>
										<ActivityIndicator color={colors.lightGreen} />
									</View>
								);
							} else {
								return (
									<View>
										<Text style={{ color: colors.lightGreen }}>
											No games yet...
										</Text>
									</View>
								);
							}
						}}
						ListFooterComponent={() => {
							if (!nextToken) {
								return null;
							}
							return (
								<Button
									text="Load More"
									loading={loading && !refreshing}
									onPress={() => fetchPlayer(nextToken)}
									style={{ marginTop: 40 }}
								/>
							);
						}}
					/>
					<TouchableOpacity
						onPress={() => setPlayersModal(true)}
						style={styles.newGameButton}
					>
						<Text style={styles.newGameButtonText}>New Game</Text>
					</TouchableOpacity>
				</>
			) : (
				<View style={styles.container}>
					<Text style={{ color: colors.lightGreen }}>
						You must be logged in if you want to play a multiplayer game!
					</Text>
				</View>
			)}
			<Modal
				style={{ margin: 0 }}
				isVisible={playersModal}
				backdropOpacity={0.75}
				avoidKeyboard
				onBackButtonPress={() => setPlayersModal(false)}
				onBackdropPress={() => setPlayersModal(false)}
			>
				<PlayersModal
					onItemPress={(username) => {
						setPlayersModal(false);
						navigation.navigate('MultiplayerGame', { invitee: username });
					}}
				/>
			</Modal>
		</GradientBackground>
	);
}
