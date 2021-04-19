import React, { ReactElement, useEffect, useState } from 'react';
import { SafeAreaView, Dimensions, View, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import styles from './single-player-game.styles';
import { Board, GradientBackground, Text, Button } from '@components';
import {
	BoardState,
	Cell,
	getBestMove,
	isEmpty,
	isTerminal,
	Move,
	useSounds,
	showAd,
} from '@utils';
import { difficulties, useSettings } from '@contexts/settings';
const SCREEN_WIDTH = Dimensions.get('screen').width;

export default function Game(): ReactElement {
	/* prettier-ignore */
	const [state, setState] = useState<BoardState>([
													null, null, null,
													null, null,	null,
													null, null,	null,
												  ]);
	const [turn, setTurn] = useState<'HUMAN' | 'BOT'>(Math.random() < 0.5 ? 'HUMAN' : 'BOT');

	const [humanSymbol, setHumanSymbol] = useState<'x' | 'o'>('x');
	const [botSymbol, setBotSymbol] = useState<'x' | 'o'>('o');

	const defaultCounts = { wins: 0, losses: 0, draws: 0 };
	const [gamesCount, setGamesCount] = useState(defaultCounts);

	const playSound = useSounds();
	const { settings } = useSettings();

	const gameResult = isTerminal(state);

	const insertCell = (cell: Move, symbol: 'x' | 'o') => {
		setTurn(turn === 'HUMAN' ? 'BOT' : 'HUMAN');
		const stateCopy: BoardState = [...state];
		if (stateCopy[cell] || isTerminal(stateCopy)) {
			return;
		}
		stateCopy[cell] = symbol;

		setState(stateCopy);

		symbol === 'x' ? playSound('pop1') : playSound('pop2');
	};

	const handleOnCellPressed = (cell: Move): void => {
		if (turn !== 'HUMAN') {
			return;
		}
		insertCell(cell, humanSymbol);
	};

	const getWinner = (symbol: Cell): 'HUMAN' | 'BOT' | 'DRAW' => {
		return symbol ? (symbol === humanSymbol ? 'HUMAN' : 'BOT') : 'DRAW';
	};

	const newGame = (): void => {
		/* prettier-ignore */
		setState([
			null, null, null,
			null, null, null,
			null, null, null
		]);

		setTurn(Math.random() < 0.5 ? 'HUMAN' : 'BOT');
	};

	useEffect(() => {
		if (!settings || !settings.difficulty) {
			return;
		}
		const loadCount = async () => {
			const counts = await AsyncStorage.getItem(
				`@gameCount-${difficulties[settings.difficulty]}`
			);

			if (counts) {
				setGamesCount(JSON.parse(counts as string));
			} else {
				setGamesCount(defaultCounts);
			}
		};
		loadCount();
	}, []);

	useEffect(() => {
		const saveCount = async () => {
			if (!settings || !settings.difficulty) {
				return;
			}
			await AsyncStorage.setItem(
				`@gameCount-${difficulties[settings.difficulty]}`,
				JSON.stringify(gamesCount)
			);
		};

		saveCount();
	}, [gamesCount]);

	useEffect(() => {
		if (gameResult) {
			const winner = getWinner(gameResult.winner);

			if (winner === 'HUMAN') {
				playSound('win');
				setGamesCount({ ...gamesCount, wins: gamesCount.wins + 1 });
			} else if (winner === 'BOT') {
				playSound('lose');
				setGamesCount({ ...gamesCount, losses: gamesCount.losses + 1 });
			} else {
				playSound('draw');
				setGamesCount({ ...gamesCount, draws: gamesCount.draws + 1 });
			}

			const totalGames = gamesCount.wins + gamesCount.draws + gamesCount.losses;
			if (totalGames % 3 === 0) {
				showAd();
			}
		} else {
			const makeMove = async () => {
				if (turn === 'BOT') {
					if (isEmpty(state)) {
						setHumanSymbol('o');
						setBotSymbol('x');

						const centerAndCorners = [0, 2, 4, 6, 8];
						const firstMove =
							centerAndCorners[Math.floor(Math.random() * centerAndCorners.length)];
						insertCell(firstMove as Move, 'x');
					} else {
						const best = getBestMove(
							state,
							botSymbol,
							settings ? parseInt(settings.difficulty) : -1
						);

						setTimeout(() => insertCell(best as Move, botSymbol), 400);
					}
				}
			};
			makeMove();
		}
	}, [state, turn]);

	return (
		<GradientBackground>
			<SafeAreaView style={styles.container}>
				<View>
					<Text style={styles.difficulty}>
						Difficulty: {settings ? difficulties[settings.difficulty] : 'Impossible'}
					</Text>
					<View style={styles.results}>
						<View style={styles.resultsBox}>
							<Text style={styles.resultsTitle}>Wins</Text>
							<Text style={styles.resultsCount}>{gamesCount.wins}</Text>
						</View>
						<View style={styles.resultsBox}>
							<Text style={styles.resultsTitle}>Draws</Text>
							<Text style={styles.resultsCount}>{gamesCount.draws}</Text>
						</View>
						<View style={styles.resultsBox}>
							<Text style={styles.resultsTitle}>Losses</Text>
							<Text style={styles.resultsCount}>{gamesCount.losses}</Text>
						</View>
					</View>
				</View>
				<Board
					disabled={Boolean(isTerminal(state)) || turn !== 'HUMAN'}
					onCellPressed={(cell) => handleOnCellPressed(cell as Move)}
					state={state}
					size={SCREEN_WIDTH - 60}
					gameResult={gameResult}
				/>
				{gameResult && (
					<View style={styles.modal}>
						<Text style={styles.modalText}>
							{getWinner(gameResult.winner) === 'HUMAN' && 'You Win!'}
							{getWinner(gameResult.winner) === 'BOT' && 'You Lose!'}
							{getWinner(gameResult.winner) === 'DRAW' && "It's a draw!"}
						</Text>
						<Button onPress={newGame} text="Play Again?" />
					</View>
				)}
			</SafeAreaView>
		</GradientBackground>
	);
}
