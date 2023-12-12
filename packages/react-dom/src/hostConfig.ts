import { FiberNode } from 'react-reconciler/src/fiber';
import { HostText } from 'react-reconciler/src/workTags';

export type Container = any;
export type Instance = any;

export const createInstance = (type: string, props: any) => {
	// TODO: 处理 props
	const element = document.createElement(type);
	return element;
};

export const createTextInstance = (content: string) => {
	return document.createTextNode(content);
};

export const appendInitialChild = (parent: Instance | Container, child: Instance) => {
	parent.appendChild(child);
};

export const appendChildToContainer = appendInitialChild;

export const commitUpdate = (fiber: FiberNode) => {
	switch (fiber.tag) {
		case HostText:
			const text = fiber.memorizedProps.content;
			return commitTextUpdate(fiber.stateNode, text);
		default:
			if (__DEV__) {
				console.warn('unachieved update');
			}
	}
};

export const commitTextUpdate = (textInstance: Text, content: string) => {
	textInstance.textContent = content;
};
