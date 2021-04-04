import React, { ReactElement, useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native';

import styles from './single-player-game.styles';
import { Board, GradientBackground } from '@components';
import { BoardState, getBestMove, isEmpty, isTerminal, Move } from '@utils';

export default function Game(): ReactElement {
	// prettier-ignore
	const [state, setState] = useState<BoardState>([
													null, null, null,
													null, null,	null,
													null, null,	null,
												  ]);
	const [turn, setTurn] = useState<'HUMAN' | 'BOT'>(Math.random() < 0.5 ? 'HUMAN' : 'BOT');

	const [humanSymbol, setHumanSymbol] = useState<'x' | 'o'>('x');
	const [botSymbol, setBotSymbol] = useState<'x' | 'o'>('x');

	const gameResult = isTerminal(state);

	const insertCell = (cell: Move, symbol: 'x' | 'o') => {
		const stateCopy: BoardState = [...state];
		if (stateCopy[cell] || isTerminal(stateCopy)) {
			return;
		}
		stateCopy[cell] = symbol;

		setState(stateCopy);
	};

	const handleOnCellPressed = (cell: Move): void => {
		if (turn !== 'HUMAN') {
			return;
		}
		insertCell(cell, humanSymbol);
		setTurn('BOT');
	};

	useEffect(() => {
		if (turn === 'BOT') {
			setHumanSymbol('o');
		} else {
			setBotSymbol('o');
		}
	}, []);

	useEffect(() => {
		if (gameResult) {
			// handle game finished
			alert('Game Over');
		} else {
			if (turn === 'BOT') {
				if (isEmpty(state)) {
					const centerAndCorners = [0, 2, 4, 6, 8];
					const firstMove =
						centerAndCorners[Math.floor(Math.random() * centerAndCorners.length)];
					insertCell(firstMove as Move, botSymbol);
				} else {
					const best = getBestMove(state, botSymbol, -1);
					insertCell(best as Move, botSymbol);
				}
				setTurn('HUMAN');
			}
		}
	}, [state, turn]);

	return (
		<GradientBackground>
			<SafeAreaView style={styles.container}>
				<Board
					disabled={Boolean(isTerminal(state)) || turn !== 'HUMAN'}
					onCellPressed={(cell) => handleOnCellPressed(cell as Move)}
					state={state}
					size={300}
				/>
			</SafeAreaView>
		</GradientBackground>
	);
}
