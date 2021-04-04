import { BoardState, Move } from './types';
import { getAvailableMoves, isTerminal } from './board';

export const getBestMove = (state: BoardState, symbol: 'x' | 'o', maxDepth = -1): number => {
	const childScores: { [key: number]: Move[] } = {};

	const getBestScore = (
		state: BoardState,
		symbol: 'x' | 'o',
		depth: number,
		maxDepth: number
	): number => {
		const terminalObject = isTerminal(state);
		if (terminalObject || depth === maxDepth) {
			if (terminalObject && terminalObject.winner === 'x') {
				return 100 - depth;
			} else if (terminalObject && terminalObject.winner === 'o') {
				return depth - 100;
			}
			return 0;
		}

		if (symbol === 'x') {
			// Maximising
			let best = -100;
			getAvailableMoves(state).forEach((index) => {
				const child: BoardState = [...state];
				child[index] = symbol;

				const childScore = getBestScore(child, 'o', depth + 1, maxDepth);
				best = Math.max(best, childScore);

				if (depth === 0) {
					childScores[childScore] = childScores[childScore]
						? [index, ...childScores[childScore]]
						: [index];
				}
			});

			return best;
		} else {
			// Minimising
			let best = 100;
			getAvailableMoves(state).forEach((index) => {
				const child: BoardState = [...state];
				child[index] = symbol;

				const childScore = getBestScore(child, 'x', depth + 1, maxDepth);
				best = Math.min(best, childScore);

				if (depth === 0) {
					childScores[childScore] = childScores[childScore]
						? [index, ...childScores[childScore]]
						: [index];
				}
			});

			return best;
		}
	};

	const best = getBestScore(state, symbol, 0, maxDepth);
	const moves = childScores[best];
	const rand = Math.floor(Math.random() * moves.length);
	return moves[rand];
};
