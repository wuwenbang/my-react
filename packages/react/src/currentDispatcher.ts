import { Action } from 'shared/ReactTypes';

export interface Dispatcher {
	useState: <T>(initialState: T | (() => T)) => [T, Dispatch<T>];
}

export type Dispatch<State> = (action: Action<State>) => void;

export const currentDispatcher: { current: Dispatcher | null } = {
	current: null
};

export const resolveDispatcher = () => {
	const dispatcher = currentDispatcher.current;
	if (!dispatcher) {
		throw new Error('hooks 只有在函数组件中才能使用');
	}
	return dispatcher;
};
