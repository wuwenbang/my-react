import { REACT_ELEMENT_TYPE } from '../../shared/ReactSymbols';
import { Type, Key, Ref, Props, ElementType } from '../../shared/ReactTypes';
const ReactElement = (type: Type, key: Key, ref: Ref, props: Props) => {
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
		const val = props[propKey];
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
		if ({}.hasOwnProperty.call(props, propKey)) {
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

export const jsxDEV = jsx;
