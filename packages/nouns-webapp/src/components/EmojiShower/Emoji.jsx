import React from 'react';
// import styled from 'styled-components';
import classes from './EmojiShower.module.css';

// export const StyledEmoji = styled.span`
// 	font-size: 5.5rem;
// 	width: 10rem;
// 	height: 10rem;
// 	display: flex;
// 	align-items: center;
// 	justify-content: center;
// 	border-radius: 50%;
// 	background: ${({ emoji }) => {
// 		switch (emoji) {
// 			case '👏':
// 				return '#ffc3348f';
// 			case '💩':
// 				return '#92542b8f';
// 			case '😂':
// 				return '#00c0f38f';
// 			case '😡':
// 				return '#f835008f';
// 			case '👽':
// 				return '#7ad7748f';
// 			default:
// 				return '#4949498f';
// 		}
// 	}};
// 	cursor: pointer;
// 	transition: 0.3s ease-in-out;
// 	&:not(:last-child) {
// 		margin-right: 3rem;
// 	}
// 	&:hover {
// 		transform: translateY(-0.8rem);
// 	}
// 	&:active {
// 		font-size: 4.4rem;
// 	}
// `;

function Emoji({refer, emoji, handleClick }) {
	return (
		<span className={classes.StyledEmoji} ref={refer} emoji={'👏'} onClick={() => handleClick('👏')}>
			{'👏'}
		</span>
	);
}

export default Emoji;