const isEmpty = (state) => {
	return state.every((cell) => cell === null);
};

const isFull = (state) => {
	return state.every((cell) => cell !== null);
};

const isTerminal = (state) => {
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
			const result = {
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

module.exports = isTerminal;
