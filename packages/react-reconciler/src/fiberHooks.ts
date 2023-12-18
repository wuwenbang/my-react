import { Dispatch, Dispatcher } from 'react/src/currentDispatcher';
import internals from 'shared/internals';
import { Action } from 'shared/ReactTypes';
import { FiberNode } from './fiber';
import {
	createUpdate,
	createUpdateQueue,
	enqueueUpdate,
	processUpdateQueue,
	UpdateQueue
} from './updateQueue';
import { scheduleUpdateOnFiber } from './workLoop';

interface Hook {
	memorizedState: any;
	updateQueue: unknown;
	next: Hook | null;
}

let currentlyRenderingFiber: FiberNode | null = null;
let workInProgressHook: Hook | null = null;
let currentHook: Hook | null = null;
const { currentDispatcher } = internals;

export const renderWithHooks = (wip: FiberNode) => {
	// 赋值操作
	currentlyRenderingFiber = wip;
	wip.memorizedState = null;

	const current = wip.alternate;

	if (current !== null) {
		// update
		currentDispatcher.current = HooksDispatcherOnUpdate;
	} else {
		// mount
		currentDispatcher.current = HooksDispatcherOnMount;
	}

	const Component = wip.type;
	const props = wip.pendingProps;
	const children = Component(props);
	// 重置操作
	currentlyRenderingFiber = null;
	workInProgressHook = null;
	currentHook = null;
	return children;
};

const mountState = <State>(initialState: State | (() => State)): [State, Dispatch<State>] => {
	const hook = mountWorkInProgressHook();
	let memorizedState;
	if (initialState instanceof Function) {
		memorizedState = initialState();
	} else {
		memorizedState = initialState;
	}
	const queue = createUpdateQueue<State>();
	hook.updateQueue = queue;
	hook.memorizedState = memorizedState;
	// @ts-ignore
	const dispatch = dispatchSetState.bind(null, currentlyRenderingFiber, queue);
	queue.dispatch = dispatch;
	return [memorizedState, dispatch];
};

const updateState = <State>(): [State, Dispatch<State>] => {
	const hook = updateWorkInProgressHook();

	// 计算新state的逻辑
	const queue = hook.updateQueue as UpdateQueue<State>;
	const pending = queue.shared.pending;

	if (pending !== null) {
		const { memorizedState } = processUpdateQueue(hook.memorizedState, pending);
		hook.memorizedState = memorizedState;
	}

	return [hook.memorizedState, queue.dispatch as Dispatch<State>];
};

const HooksDispatcherOnMount: Dispatcher = {
	useState: mountState
};

const HooksDispatcherOnUpdate: Dispatcher = {
	useState: updateState
};

const dispatchSetState = <State>(
	fiber: FiberNode,
	updateQueue: UpdateQueue<State>,
	action: Action<State>
) => {
	const update = createUpdate(action);
	enqueueUpdate(updateQueue, update);
	scheduleUpdateOnFiber(fiber);
};

const mountWorkInProgressHook = (): Hook => {
	const hook: Hook = {
		memorizedState: null,
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

const updateWorkInProgressHook = (): Hook => {
	// TODO render阶段触发的更新
	let nextCurrentHook: Hook | null;

	if (currentHook === null) {
		// 这是这个FC update时的第一个hook
		const current = currentlyRenderingFiber?.alternate;
		if (current !== null) {
			nextCurrentHook = current?.memorizedState;
		} else {
			// mount
			nextCurrentHook = null;
		}
	} else {
		// 这个FC update时 后续的hook
		nextCurrentHook = currentHook.next;
	}

	if (nextCurrentHook === null) {
		// mount/update u1 u2 u3
		// update       u1 u2 u3 u4
		throw new Error(`组件${currentlyRenderingFiber?.type}本次执行时的Hook比上次执行时多`);
	}

	currentHook = nextCurrentHook as Hook;
	const newHook: Hook = {
		memorizedState: currentHook.memorizedState,
		updateQueue: currentHook.updateQueue,
		next: null
	};
	if (workInProgressHook === null) {
		// mount时 第一个hook
		if (currentlyRenderingFiber === null) {
			throw new Error('请在函数组件内调用hook');
		} else {
			workInProgressHook = newHook;
			currentlyRenderingFiber.memorizedState = workInProgressHook;
		}
	} else {
		// mount时 后续的hook
		workInProgressHook.next = newHook;
		workInProgressHook = newHook;
	}
	return workInProgressHook;
};
