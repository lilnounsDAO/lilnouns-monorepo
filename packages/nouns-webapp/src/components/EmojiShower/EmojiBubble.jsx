import React from 'react';
// import styled, { keyframes } from 'styled-components';
import ExpireEmoji from './ExpireEmoji';
import classes from "./EmojiShower.module.css"

// const bubble = keyframes`
//     from {
//         bottom: -15%;
//     }
//     to {
//         bottom: 115%;
//     }
// `;

// const StyledEmojiBubble = styled.span`
// 	position: absolute;
// 	font-size: ${({ size }) => `${size}rem`};
// 	left: ${({ left }) => `${left}%`};
// 	animation: ${bubble} 6s ease-out;
// `;

const randomSize = (min, max) => (Math.random() * (max - min + 1) + min).toFixed(2);

function EmojiBubble(props) {
	const aa = {size: randomSize(2.2, 4.1), left: 85}

	return (
		<ExpireEmoji>
			<span className={classes.StyledEmojiBubble} {...aa}>{'🤌'}</span>
		</ExpireEmoji>
	);
}

export default EmojiBubble;