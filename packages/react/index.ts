/** React */

import { currentDispatcher, Dispatcher, resolveDispatcher } from './src/currentDispatcher';
import { jsx, isValidElement as _isValidElement } from './src/jsx';

export const version = '0.0.0';

// TODO 根据环境使用 jsx / jsxDEV
export const createElement = jsx;

export const isValidElement = _isValidElement;

export const useState: Dispatcher['useState'] = (initialState) => {
	const dispacher = resolveDispatcher();
	return dispacher.useState(initialState);
};

export const __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = {
	currentDispatcher
};
