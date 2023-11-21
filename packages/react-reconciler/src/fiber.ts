import { Props, Key, ReactElementType } from 'shared/ReactTypes';
import { Flags, NoFlags } from './fiberFlags';
import { FunctionComponent, HostComponent, WorkTag } from './workTags';
import { Container } from './hostConfig';
export class FiberNode {
	type: any;
	tag: WorkTag;
	key: Key;
	stateNode: any;
	return: FiberNode | null;
	sibling: FiberNode | null;
	child: FiberNode | null;
	index: number;
	pendingProps: Props;
	memorizedProps: Props | null;
	memorizedState: any;
	alternate: FiberNode | null;
	flags: number;
	updateQueue: unknown;
	subtreeFlags: Flags;
	constructor(tag: WorkTag, peddingProps: Props, key: Key) {
		this.tag = tag;
		this.key = key;
		// DOM Node
		this.stateNode = null;
		this.type = null;
		// 指向父级 FiberNode
		this.return = null;
		// 指向兄弟 FiberNode
		this.sibling = null;
		// 指向子级 FiberNode
		this.child = null;
		this.index = 0;
		// 工作前的 Props
		this.pendingProps = peddingProps;
		// 工作后的 Props
		this.memorizedProps = null;
		// 工作后的 State
		this.memorizedState = null;
		// 更新队列
		this.updateQueue = null;
		// WorkInProgress -> Current / Current -> WorkInProgress
		this.alternate = null;
		// effect
		this.flags = NoFlags;
		this.subtreeFlags = NoFlags;
	}
}

export class FiberRootNode {
	container: Container;
	current: FiberNode;
	finishedWork: FiberNode | null;
	constructor(container: Container, hostRootFiber: FiberNode) {
		this.container = container;
		this.current = hostRootFiber;
		hostRootFiber.stateNode = this;
		this.finishedWork = null;
	}
}

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
		wip.subtreeFlags = NoFlags;
	}
	wip.updateQueue = current.updateQueue;
	wip.child = current.child;
	wip.memorizedProps = current.memorizedProps;
	wip.memorizedState = current.memorizedState;
	return wip;
};

export const createFiberFromElement = (element: ReactElementType): FiberNode => {
	const { type, key, props } = element;
	let fiberTag: WorkTag = FunctionComponent;

	if (typeof type === 'string') {
		fiberTag = HostComponent;
	} else if (typeof type !== 'function' && __DEV__) {
		console.warn('未定义的type类型', element);
	}
	const fiber = new FiberNode(fiberTag, props, key);
	fiber.type = type;
	return fiber;
};
