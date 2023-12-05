// import internals from 'shared/internals';
import { FiberNode } from './fiber';

interface Hook {
	memoizedState: any;
	updateQueue: unknown;
	next: Hook | null;
}

let currentRenderingFiber: FiberNode | null = null;
let currentlyRenderingFiber: FiberNode | null = null;
let workInProgressHook: Hook | null = null;

export const renderWithHooks = (wip: FiberNode) => {
	// 赋值操作
	currentRenderingFiber = wip;
	wip.memorizedState = null;

	const current = wip.alternate;

	if (current !== null) {
		// update
	} else {
		// mount
	}

	const Component = wip.type;
	const props = wip.pendingProps;
	const children = Component(props);
	// 重置操作
	currentRenderingFiber = null;
	return children;
};

const mountWorkInProgresHook = (): Hook => {
	const hook: Hook = {
		memoizedState: null,
		updateQueue: null,
		next: null
	};
	if (workInProgressHook === null) {
		// mount时 第一个hook
		if (currentlyRenderingFiber === null) {
			throw new Error('请在函数组件内调用hook');
		} else {
			workInProgressHook = hook;
			currentlyRenderingFiber.memorizedState = workInProgressHook;
		}
	} else {
		// mount时 后续的hook
		workInProgressHook.next = hook;
		workInProgressHook = hook;
	}
	return workInProgressHook;
};
