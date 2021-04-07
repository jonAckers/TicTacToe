import React, { ReactElement, useRef, useEffect } from 'react';
import { Animated } from 'react-native';

import styles from './board-line.styles';
import { BoardResult } from '@utils';

type BoardLineProps = {
	size: number;
	gameResult?: BoardResult | false;
};

export default function BoardLine({ size, gameResult }: BoardLineProps): ReactElement {
	const animationRef = useRef<Animated.Value>(new Animated.Value(0));
	const diagonalHeight = Math.sqrt(Math.pow(size, 2) * 2);

	useEffect(() => {
		Animated.timing(animationRef.current, {
			toValue: 1,
			duration: 700,
			useNativeDriver: false,
		}).start();
	}, []);

	return (
		<>
			{gameResult && gameResult.column && gameResult.direction === 'V' && (
				<Animated.View
					style={[
						styles.line,
						styles.vLine,
						{
							left: `${33.33333 * gameResult.column - 16.66666}%`,
							height: animationRef.current.interpolate({
								inputRange: [0, 1],
								outputRange: ['0%', '100%'],
							}),
						},
					]}
				></Animated.View>
			)}
			{gameResult && gameResult.row && gameResult.direction === 'H' && (
				<Animated.View
					style={[
						styles.line,
						styles.hLine,
						{
							top: `${33.33333 * gameResult.row - 16.66666}%`,
							width: animationRef.current.interpolate({
								inputRange: [0, 1],
								outputRange: ['0%', '100%'],
							}),
						},
					]}
				></Animated.View>
			)}
			{gameResult && gameResult.diagonal && gameResult.direction === 'D' && (
				<Animated.View
					style={[
						styles.line,
						styles.dLine,
						{
							height: animationRef.current.interpolate({
								inputRange: [0, 1],
								outputRange: [0, diagonalHeight],
							}),
							transform: [
								{
									translateY: animationRef.current.interpolate({
										inputRange: [0, 1],
										outputRange: [size / 2, (size - diagonalHeight) / 2],
									}),
								},
								{ rotateZ: gameResult.diagonal === 'MAIN' ? '-45deg' : '45deg' },
							],
						},
					]}
				></Animated.View>
			)}
		</>
	);
}
