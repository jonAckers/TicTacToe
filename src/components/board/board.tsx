import React, { ReactElement } from 'react';
import { View, TouchableOpacity } from 'react-native';

import styles from './board.styles';
import Text from '../text/text';
import { BoardResult, BoardState } from '@utils';
import BoardLine from './board-line';

type BoardProps = {
	state: BoardState;
	size: number;
	disabled?: boolean;
	gameResult?: BoardResult | false;
	onCellPressed?: (index: number) => void;
};

export default function Board({
	state,
	size,
	disabled,
	onCellPressed,
	gameResult,
}: BoardProps): ReactElement {
	return (
		<View
			style={[
				styles.board,
				{
					width: size,
					height: size,
				},
			]}
		>
			{state.map((cell, index) => {
				return (
					<TouchableOpacity
						disabled={cell !== null || disabled}
						onPress={() => onCellPressed && onCellPressed(index)}
						key={`Cell ${index}`}
						style={[styles.cell, styles[`cell${index}` as 'cell']]}
					>
						<Text style={[styles.cellText, { fontSize: size / 5 }]}>{cell}</Text>
					</TouchableOpacity>
				);
			})}
			{gameResult && <BoardLine size={size} gameResult={gameResult} />}
		</View>
	);
}
