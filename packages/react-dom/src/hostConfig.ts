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
