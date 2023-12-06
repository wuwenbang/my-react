import React, { useState } from 'react';
import ReactDOM from 'react-dom';
const App = () => {
	const [count, setCount] = useState(100);
	return (
		<div>
			{count}
		</div>
	);
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);

console.log('React', React);
console.log('jsx', App);
console.log('ReactDOM', ReactDOM);
