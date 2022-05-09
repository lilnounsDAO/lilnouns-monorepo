import React, { useEffect, useState } from 'react';
// import styled from 'styled-components';
// import background from '../assets/back.jpg';
// import Emoji from '../../components/EmojiShower/Emoji';
import EmojiBubble from '../../components/EmojiShower/EmojiBubble.jsx';


// const StyledApp = styled.div`
// 	min-height: 100vh;
// 	display: flex;
// 	justify-content: center;
// 	align-items: center;
// `;

const Emojis = () => {
	// const emojiList = ['👏', '💩', '😂', '😡', '🤌'];

	const [emojiQueue, setEmojiQueue] = useState([""]);
	// const [isFirst, setIsFirst] = useState(true);

	const randomSize = (min: number, max: number) =>
		(Math.random() * (max - min + 1) + min).toFixed(2);

	// const randomLeft = () => {
	// 	const maths = Math.floor(Math.random() * 97 + 1)
	// 	console.log(`RANDOMLEFT: ${maths}`);
	// 	return maths
	// };

	// const inputRef = React.useRef<HTMLButtonElement>(null)

	// const handleClick = (emoji: any) => {
	// 	animate(emoji)
	// };

	useEffect(() => {
		// if(isFirst == true) {
		// 	inputRef.current!.click()
		// 	setIsFirst(false)
		// }

		animate("hf")
		
	})//[setIsFirst])

	async function animate(emoji: any){

		setEmojiQueue((prevState: any[]) => [ ...prevState, { emoji, size: randomSize(2.2, 4.1), left: 85 }, ])
		await timeout(600);
		setEmojiQueue((prevState: any[]) => [ ...prevState, { emoji, size: randomSize(2.2, 4.1), left: 34 }, ])
		await timeout(300);
		setEmojiQueue((prevState: any[]) => [ ...prevState, { emoji, size: randomSize(2.2, 4.1), left: 60 }, ])
		await timeout(700);
		setEmojiQueue((prevState: any[]) => [ ...prevState, { emoji, size: randomSize(2.2, 4.1), left: 17 }, ])
		await timeout(500);
		setEmojiQueue((prevState: any[]) => [ ...prevState, { emoji, size: randomSize(2.2, 4.1), left: 37 }, ])
		await timeout(600);
		setEmojiQueue((prevState: any[]) => [ ...prevState, { emoji, size: randomSize(2.2, 4.1), left: 65 }, ])
		await timeout(200);
		setEmojiQueue((prevState: any[]) => [ ...prevState, { emoji, size: randomSize(2.2, 4.1), left: 89 }, ])
		await timeout(600);
		setEmojiQueue((prevState: any[]) => [ ...prevState, { emoji, size: randomSize(2.2, 4.1), left: 72 }, ])
		await timeout(200);
		setEmojiQueue((prevState: any[]) => [ ...prevState, { emoji, size: randomSize(2.2, 4.1), left: 12 }, ])
		await timeout(500);
		setEmojiQueue((prevState: any[]) => [ ...prevState, { emoji, size: randomSize(2.2, 4.1), left: 31 }, ])
		await timeout(200);
		setEmojiQueue((prevState: any[]) => [ ...prevState, { emoji, size: randomSize(2.2, 4.1), left: 34 }, ])
		await timeout(100);
		setEmojiQueue((prevState: any[]) => [ ...prevState, { emoji, size: randomSize(2.2, 4.1), left: 73 }, ])
		await timeout(400);
		setEmojiQueue((prevState: any[]) => [ ...prevState, { emoji, size: randomSize(2.2, 4.1), left: 23 }, ])
		await timeout(300);
		setEmojiQueue((prevState: any[]) => [ ...prevState, { emoji, size: randomSize(2.2, 4.1), left: 51 }, ])
		await timeout(600);
		setEmojiQueue((prevState: any[]) => [ ...prevState, { emoji, size: randomSize(2.2, 4.1), left: 85 }, ])
	}

	// const emojiMarkup = emojiList.map((emoji, i) => (
	// 	<Emoji refer={inputRef} key={i} emoji={emoji} handleClick={handleClick} />
	// ));

	const emojiBubbleMarkup = emojiQueue.map((emojiVals, i) => (
		<EmojiBubble key={i} {...emojiVals} />
	));

	return (
		<>
			{/* <StyledApp>{emojiMarkup}</StyledApp> */}
			{emojiBubbleMarkup}
		</>
	);
}

export default Emojis;

function timeout(delay: number) {
    return new Promise( res => setTimeout(res, delay) );
}