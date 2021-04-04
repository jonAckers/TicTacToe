import { BoardResult, BoardState, Move } from './types';

export const printFormattedBoard = (state: BoardState): void => {
	let formattedString = '';
	state.forEach((cell, index) => {
		formattedString += cell ? ` ${cell} |` : '   |';

		if (index % 3 === 2) {
			formattedString = formattedString.slice(0, -1);
			formattedString += '\n';
			if (index < 8) {
				formattedString += '---+---+---';
				formattedString += '\n';
			}
		}
	});

	// eslint-disable-next-line
	console.log(formattedString);
};

export const printFormattedScores = (scores: { [key: string]: Move[] }): void => {
	let formattedString = '';

	for (let i = 0; i < 9; i++) {
		let toPrint = '    |';
		Object.keys(scores).filter((score: string) => {
			if (scores[score].includes(i as Move)) {
				toPrint = `    ${score} |`.slice(-5);
			}
		});

		formattedString += toPrint;
		if (i % 3 === 2) {
			formattedString = formattedString.slice(0, -1);
			formattedString += '\n';
			if (i < 8) {
				formattedString += '----+----+----';
				formattedString += '\n';
			}
		}
	}

	// eslint-disable-next-line
	console.log(formattedString);
};

export const isEmpty = (state: BoardState): boolean => {
	return state.every((cell) => cell === null);
};

export const isFull = (state: BoardState): boolean => {
	return state.every((cell) => cell !== null);
};

export const getAvailableMoves = (state: BoardState): Move[] => {
	const moves: Move[] = [];
	state.forEach((cell, index) => {
		if (cell === null) {
			moves.push(index as Move);
		}
	});

	return moves;
};

export const isTerminal = (state: BoardState): BoardResult | false => {
	if (isEmpty(state)) {
		return false;
	}

	const winningLines = [
		// Horizontal
		[0, 1, 2],
		[3, 4, 5],
		[6, 7, 8],
		// Vertical
		[0, 3, 6],
		[1, 4, 7],
		[2, 5, 8],
		// Diagonal
		[0, 4, 8],
		[2, 4, 6],
	];

	for (let i = 0; i < winningLines.length; i++) {
		const line = winningLines[i];
		const [cell0, cell1, cell2] = line;

		if (
			state[cell0] !== null &&
			state[cell0] === state[cell1] &&
			state[cell0] === state[cell2]
		) {
			const result: BoardResult = {
				winner: state[cell0],
			};

			if (i < 3) {
				result.direction = 'H';
				result.row = i === 0 ? 1 : i === 1 ? 2 : 3;
			} else if (i < 6) {
				result.direction = 'V';
				result.column = i === 3 ? 1 : i === 4 ? 2 : 3;
			} else {
				result.direction = 'D';
				result.diagonal = i === 6 ? 'MAIN' : 'COUNTER';
			}

			return result;
		}
	}

	return isFull(state) ? { winner: null } : false;
};
