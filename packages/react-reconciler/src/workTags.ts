export type WorkTag =
	| typeof FunctionComponent
	| typeof HostRoot
	| typeof HostComponent
	| typeof HostText;
export const FunctionComponent = 0;
// DOM Root Node
export const HostRoot = 3;
// DOM Node
export const HostComponent = 5;
// DOM Text Node
export const HostText = 6;
