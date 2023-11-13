import { Props, Key } from 'shared/ReactTypes';
import { NoFlags } from './fiberFlags';
import { WorkTag } from './workTags';
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
	alternate: FiberNode | null;
	flags: number;
	updateQueue: unknown;
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
		// 更新队列
		this.updateQueue = null;
		// WorkInProgress -> Current / Current -> WorkInProgress
		this.alternate = null;
		// effect
		this.flags = NoFlags;
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
