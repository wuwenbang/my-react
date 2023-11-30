import React from 'react';
import ReactDOM from 'react-dom';
const App = () => {
	return (
		<div>
			<Child />
		</div>
	);
};
const Child = () => {
	return <span>Hello React!</span>;
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);

console.log('React', React);
console.log('jsx', App);
console.log('ReactDOM', ReactDOM);
