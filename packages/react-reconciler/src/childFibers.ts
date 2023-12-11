import { REACT_ELEMENT_TYPE } from 'shared/ReactSymbols';
import { Props, ReactElementType } from 'shared/ReactTypes';
import { createFiberFromElement, createWorkInProgress, FiberNode } from './fiber';
import { ChildDeletion, Placement } from './fiberFlags';
import { HostText } from './workTags';

const ChildReconciler = (shouldTrackEffects: boolean) => {
	const deleteChild = (returnFiber: FiberNode, childToDelete: FiberNode) => {
		if (!shouldTrackEffects) {
			return;
		}
		const deletions = returnFiber.deletions;
		if (deletions === null) {
			returnFiber.deletions = [childToDelete];
			returnFiber.flags |= ChildDeletion;
		} else {
			deletions.push(childToDelete);
		}
	};
	const reconcileSingleElement = (
		returnFiber: FiberNode,
		currentFiber: FiberNode | null,
		element: ReactElementType
	) => {
		// fiber existed
		if (currentFiber !== null) {
			const key = element.key;
			// is react element type
			if (element.$$typeof === REACT_ELEMENT_TYPE) {
				// same key and same type to update
				if (currentFiber.key === key && currentFiber.type === element.type) {
					// reuse fiber
					const existing = useFiber(currentFiber, element.props);
					existing.return = returnFiber;
					return existing;
				}
				// different key or different type to delete
				deleteChild(returnFiber, currentFiber);
			} else {
				if (__DEV__) {
					console.warn('未实现的reconcile类型', element);
				}
			}
		}
		// create fiber by element
		const fiber = createFiberFromElement(element);
		fiber.return = returnFiber;
		return fiber;
	};
	const reconcileSingleTextNode = (
		returnFiber: FiberNode,
		currentFiber: FiberNode | null,
		content: string | number
	) => {
		// fiber existed
		if (currentFiber !== null) {
			// same type to update
			if (currentFiber.tag === HostText) {
				// reuse fiber
				const existing = useFiber(currentFiber, { content });
				existing.return = returnFiber;
				return existing;
			}
			// different type to delete
			deleteChild(returnFiber, currentFiber);
		}
		// create fiber by text
		const fiber = new FiberNode(HostText, { content }, null);
		fiber.return = returnFiber;
		return fiber;
	};
	const placeSingleChild = (fiber: FiberNode) => {
		if (shouldTrackEffects && fiber.alternate === null) {
			fiber.flags |= Placement;
		}
		return fiber;
	};
	const reconcileChildFibers = (
		returnFiber: FiberNode,
		currentFiber: FiberNode | null,
		newChild?: ReactElementType
	) => {
		// 判断当前fiber的类型
		// HostComponent
		if (typeof newChild === 'object' && newChild !== null) {
			switch (newChild.$$typeof) {
				case REACT_ELEMENT_TYPE:
					return placeSingleChild(reconcileSingleElement(returnFiber, currentFiber, newChild));
				default:
					if (__DEV__) {
						console.warn('未实现的reconcile类型', newChild);
					}
					break;
			}
		}
		// TODO 多节点的情况 ul> li*3

		// HostText
		if (typeof newChild === 'string' || typeof newChild === 'number') {
			return placeSingleChild(reconcileSingleTextNode(returnFiber, currentFiber, newChild));
		}

		// 兜底情况删除节点
		if (currentFiber !== null) deleteChild(returnFiber, currentFiber);

		if (__DEV__) {
			console.warn('未实现的reconcile类型', newChild);
		}
		return null;
	};
	return reconcileChildFibers;
};

export const useFiber = (fiber: FiberNode, pendingProps: Props) => {
	const clone = createWorkInProgress(fiber, pendingProps);
	clone.index = 0;
	clone.sibling = null;
	return clone;
};

export const reconcileChildFibers = ChildReconciler(true);
export const mountChildFibers = ChildReconciler(false);
