import React, { ReactElement } from 'react';
import { View, TouchableOpacity, ActivityIndicator } from 'react-native';

import styles from './board.styles';
import Text from '../text/text';
import { BoardResult, BoardState, colors, Move } from '@utils';
import BoardLine from './board-line';

type BoardProps = {
	state: BoardState;
	size: number;
	disabled?: boolean;
	loading?: Move | null;
	gameResult?: BoardResult | false;
	onCellPressed?: (index: number) => void;
};

export default function Board({
	state,
	size,
	disabled,
	loading,
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
						{loading === index ? (
							<ActivityIndicator color={colors.lightGreen} />
						) : (
							<Text style={[styles.cellText, { fontSize: size / 5 }]}>{cell}</Text>
						)}
					</TouchableOpacity>
				);
			})}
			{gameResult && <BoardLine size={size} gameResult={gameResult} />}
		</View>
	);
}
