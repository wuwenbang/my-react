export type Type = any;
export type Key = any;
export type Ref = any;
export type Props = any;
export type ElementType = any;

export interface ReactElement {
	$$typeof: symbol | number;
	type: Type;
	props: Props;
	key: Key | null;
	ref: Ref | null;
	__mark: string;
}
