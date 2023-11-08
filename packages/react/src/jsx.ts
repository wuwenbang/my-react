import { REACT_ELEMENT_TYPE } from '../../shared/ReactSymbols';
import { Type, Key, Ref, Props, ElementType, ReactElementType } from '../../shared/ReactTypes';
const ReactElement = (type: Type, key: Key, ref: Ref, props: Props): ReactElementType => {
	const element = {
		$$typeof: REACT_ELEMENT_TYPE,
		type,
		key,
		ref,
		props,
		__mark: 'LeoWu'
	};
	return element;
};

export const jsx = (type: ElementType, params: any, ...children: any) => {
	let key: Key = null;
	let ref: Ref = null;
	const props: Props = {};
	for (const propKey in params) {
		const val = params[propKey];
		if (propKey === 'key') {
			if (val !== undefined) {
				key = '' + val;
			}
			continue;
		}
		if (propKey === 'ref') {
			if (val !== undefined) {
				ref = val;
			}
			continue;
		}
		// 判断是否是自有属性（而不是继承来的属性）
		if ({}.hasOwnProperty.call(params, propKey)) {
			props[propKey] = val;
		}
	}
	const childrenLength = children.length;
	if (childrenLength) {
		if (childrenLength === 1) {
			props.children = children[0];
		} else {
			props.children = children;
		}
	}
	return ReactElement(type, key, ref, props);
};

export const jsxDEV = (type: ElementType, params: any) => {
	console.log(type, params);
	let key: Key = null;
	let ref: Ref = null;
	const props: Props = {};
	for (const propKey in params) {
		const val = params[propKey];
		if (propKey === 'key') {
			if (val !== undefined) {
				key = '' + val;
			}
			continue;
		}
		if (propKey === 'ref') {
			if (val !== undefined) {
				ref = val;
			}
			continue;
		}
		// 判断是否是自有属性（而不是继承来的属性）
		if ({}.hasOwnProperty.call(params, propKey)) {
			props[propKey] = val;
		}
	}
	return ReactElement(type, key, ref, props);
};
