import * as React from "react";

// Uses an absolute-sized div to calculate a style unit type (em, rem, etc) in pixels.

interface StyleScriptProps {
	input: string;
	outputPixels: (pixels: number) => void;
}

export class StyleScript extends React.Component<StyleScriptProps> {

	constructor(props) {
		super(props);
		this.ref = React.createRef<HTMLDivElement>() as React.RefObject<HTMLDivElement>;
	}

	private ref: React.RefObject<HTMLDivElement> = null;

	render() {
		return <div ref={this.ref} style={{ position: "absolute", width: "100%", height: this.props.input }} />
	}

	componentDidMount() {
		let outputPixels = -1;
		if (this.ref && this.ref.current)
			outputPixels = this.ref.current.offsetHeight;
		this.props.outputPixels(outputPixels);
	}
}