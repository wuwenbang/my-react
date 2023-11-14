import { Props } from 'shared/ReactTypes';
import { beginWork } from './beginWork';
import { completeWork } from './completeWork';
import { FiberNode, FiberRootNode } from './fiber';
import { NoFlags } from './fiberFlags';
import { HostRoot } from './workTags';

let workInProgress: FiberNode | null = null;

const prepareFreshStack = (root: FiberRootNode) => {
	workInProgress = createWorkInProgress(root.current, {});
};

export const scheduleUpdateOnFiber = (fiber: FiberNode) => {
	// TODO: 调度功能
	const root = markUpdateFromFiberToRoot(fiber);
	renderRoot(root);
};
export const markUpdateFromFiberToRoot = (fiber: FiberNode) => {
	let current = fiber;
	let parent = current.return;
	while (parent !== null) {
		current = parent;
		parent = current.return;
	}
	if (current.tag === HostRoot) {
		return current.stateNode;
	}
	return null;
};
export const renderRoot = (root: FiberRootNode) => {
	// initial
	prepareFreshStack(root);
	do {
		try {
			workLoop();
			break;
		} catch (e) {
			console.warn('work loop error: ', e);
			workInProgress = null;
		}
	} while (true);
};

const workLoop = () => {
	while (workInProgress !== null) {
		performUnitOfWork(workInProgress);
	}
};

const performUnitOfWork = (fiber: FiberNode) => {
	const next = beginWork(fiber);
	fiber.memorizedProps = fiber.pendingProps;
	if (next === null) {
		completeUnitOfWork(fiber);
	} else {
		workInProgress = next;
	}
};

const completeUnitOfWork = (fiber: FiberNode) => {
	let node: FiberNode | null = fiber;
	do {
		completeWork(node);
		const sibling = node.sibling;
		if (sibling !== null) {
			workInProgress = sibling;
			return;
		}
		node = node.return;
		workInProgress = node;
	} while (node !== null);
};

export const createWorkInProgress = (current: FiberNode, pendingProps: Props) => {
	let wip = current.alternate;
	if (wip === null) {
		// mount
		wip = new FiberNode(current.tag, pendingProps, current.key);
		wip.type = current.type;
		wip.stateNode = current.stateNode;
		wip.alternate = current;
		current.alternate = wip;
	} else {
		// update
		wip.pendingProps = pendingProps;
		wip.flags = NoFlags;
		wip.updateQueue = current.updateQueue;
		wip.child = current.child;
		wip.memorizedProps = current.memorizedProps;
		wip.memorizedState = current.memorizedState;
	}
	return wip
};
