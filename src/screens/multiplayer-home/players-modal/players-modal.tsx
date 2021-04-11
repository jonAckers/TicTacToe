import React, { ReactElement, useEffect, useRef, useState } from 'react';
import {
	View,
	Alert,
	TextInput as NativeTextInput,
	FlatList,
	TouchableOpacity,
	ActivityIndicator,
} from 'react-native';
import { API, graphqlOperation } from 'aws-amplify';
import { GraphQLResult } from '@aws-amplify/api';
import { searchPlayersQuery } from '@api';

import styles from './players-modal.styles';
import { GradientBackground, Text, TextInput } from '@components';
import { searchPlayers } from '../multiplayer-home.graphql';
import { colors } from '@utils';

type PlayersListType = NonNullable<searchPlayersQuery['searchPlayers']>['items'];

type PlayersModalProps = {
	onItemPress: (username: string) => void;
};

export default function PlayersModal({ onItemPress }: PlayersModalProps): ReactElement {
	const [players, setPlayers] = useState<PlayersListType>(null);
	const [searchQuery, setSearchQuery] = useState('');
	const [submittedQuery, setSubmittedQuery] = useState('');
	const [loading, setLoading] = useState(false);

	const inputRef = useRef<NativeTextInput | null>(null);

	const fetchPlayers = async (searchString: string) => {
		setLoading(true);
		setSubmittedQuery(searchQuery);
		try {
			// TODO: maybe add pagination
			const players = (await API.graphql(
				graphqlOperation(searchPlayers, {
					limit: 10,
					nextToken: null,
					searchString: searchString,
				})
			)) as GraphQLResult<searchPlayersQuery>;

			if (players.data?.searchPlayers) {
				setPlayers(players.data.searchPlayers.items);
			}
		} catch (e) {
			Alert.alert('Error!', 'An error has occurred. Please try again later.');
		}
		setLoading(false);
	};

	useEffect(() => {
		setTimeout(() => inputRef.current?.focus(), 150);
	}, []);

	// TODO: Live update search results while typing (maybe?)
	// TODO: stop your username appearing when searching
	return (
		<View style={styles.modalContainer}>
			<GradientBackground>
				<View style={styles.searchContainer}>
					<TextInput
						value={searchQuery}
						ref={inputRef}
						style={{ borderBottomWidth: 0, backgroundColor: colors.darkPurple }}
						placeholder="Type to search by username or name..."
						returnKeyType="search"
						onChangeText={(text) => setSearchQuery(text)}
						onSubmitEditing={() => fetchPlayers(searchQuery)}
					/>
				</View>
				<View style={{ flex: 1 }}>
					{loading ? (
						<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
							<ActivityIndicator color={colors.lightGreen} />
						</View>
					) : (
						<FlatList
							contentContainerStyle={{ padding: 20 }}
							data={players}
							renderItem={({ item }) => (
								<TouchableOpacity
									onPress={() => {
										if (item) {
											onItemPress(item?.username);
										}
									}}
									style={styles.playerItem}
								>
									<Text style={{ color: colors.lightGreen, fontSize: 20 }}>
										{item?.name}
									</Text>
									<Text weight="400" style={{ color: colors.lightGreen }}>
										{item?.username}
									</Text>
								</TouchableOpacity>
							)}
							keyExtractor={(player) => player?.username || `${new Date().getTime()}`}
							ListEmptyComponent={() => (
								<View>
									<Text style={{ color: colors.lightGreen }}>
										{submittedQuery
											? 'No results found...'
											: 'Type to search by name or username...'}
									</Text>
								</View>
							)}
						/>
					)}
				</View>
			</GradientBackground>
		</View>
	);
}
