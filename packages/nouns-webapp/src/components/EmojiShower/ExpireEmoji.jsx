import React, { useState, useEffect } from 'react';

function ExpireEmoji({ children }) {
	const [isExpired, setIsExpired] = useState(false);

	useEffect(() => {
		setTimeout(() => setIsExpired(true), 5000);
	}, []);

	return <>{isExpired ? null : children}</>;
}

export default ExpireEmoji;