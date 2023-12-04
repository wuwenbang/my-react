/** React */

import { currentDispatcher, Dispatcher, resolveDispatcher } from './src/currentDispatcher';
import { jsxDEV } from './src/jsx';

export default {
	version: '0.0.0',
	createElement: jsxDEV
};

export const useState: Dispatcher['useState'] = (initialState) => {
	const dispacher = resolveDispatcher();
	return dispacher.useState(initialState);
};

export const __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = {
	currentDispatcher
};
