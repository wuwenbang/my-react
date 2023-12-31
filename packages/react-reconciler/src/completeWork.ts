import { FiberNode } from './fiber';
import { NoFlags, Update } from './fiberFlags';
import { appendInitialChild, Container, createInstance, createTextInstance } from 'hostConfig';
import { FunctionComponent, HostComponent, HostRoot, HostText } from './workTags';

// 递归中的归阶段
export const completeWork = (wip: FiberNode) => {
	const newProps = wip.pendingProps;
	const current = wip.alternate;
	switch (wip.tag) {
		case HostRoot:
			bubbleProperties(wip);
			return null;
		case FunctionComponent:
			bubbleProperties(wip);
			return null;
		case HostComponent:
			if (current !== null && wip.stateNode !== null) {
				// TODO HostComponent的更新
			} else {
				// 1. 构建DOM
				const instance = createInstance(wip.type, newProps);
				// 2. 将DOM插入到DOM树中
				appendAllChildren(instance, wip);
				wip.stateNode = instance;
			}
			bubbleProperties(wip);
			return null;
		case HostText:
			if (current !== null && wip.stateNode !== null) {
				const oldText = current.memorizedProps.children;
				const newText = newProps.children;
				if (oldText !== newText) {
					markUpdate(wip);
				}
			} else {
				// 1. 构建DOM
				const instance = createTextInstance(newProps.content);
				wip.stateNode = instance;
			}
			bubbleProperties(wip);
			return null;
		default:
			break;
	}
};

const appendAllChildren = (parent: Container, wip: FiberNode) => {
	let node = wip.child;
	while (node !== null) {
		// 往下找
		if (node.tag === HostComponent || node.tag === HostText) {
			// DOM节点插入
			appendInitialChild(parent, node?.stateNode);
		} else if (node.child !== null) {
			node.child.return = node;
			node = node.child;
			continue;
		}

		if (node === wip) {
			return;
		}
		// 往上找
		while (node.sibling === null) {
			if (node.return === null || node.return === wip) {
				return;
			}
			node = node.return;
		}
		node.sibling.return = node.return;
		node = node.sibling;
	}
};

const bubbleProperties = (wip: FiberNode) => {
	let subtreeFlags = NoFlags;
	let child = wip.child;
	while (child !== null) {
		subtreeFlags |= child.subtreeFlags;
		subtreeFlags |= child.flags;
		child.return = wip;
		child = child.sibling;
	}
	wip.subtreeFlags |= subtreeFlags;
};

const markUpdate = (fiber: FiberNode) => {
	fiber.flags |= Update;
};
