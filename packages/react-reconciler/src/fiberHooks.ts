// import internals from 'shared/internals';
import { FiberNode } from './fiber';

interface Hook {
	memoizedState: any;
	updateQueue: unknown;
	next: Hook | null;
}

let currentRenderingFiber: FiberNode | null = null;
const woriInProgressHook: Hook | null = null;

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
