import {Component} from "react";

export default class BinaryRepresentationHoverPopup<Type extends string> extends Component<{ value: Type, onMouseEnter: () => void, onMouseLeave: () => void }> {

    toBinary(value: Type) {
        const encoder = new TextEncoder();
        const encodedData = encoder.encode(value);
        // @ts-ignore
        return [...encodedData].map(byte => byte.toString(2)
                .padStart(8, '0')).join(' ');
    }

    render() {
        return (
            <div className="absolute bg-gray-800 text-white p-2 rounded-md shadow-md text-xs" onMouseEnter={this.props.onMouseEnter} onMouseLeave={this.props.onMouseLeave}>
                {this.toBinary(this.props.value)}
            </div>
        );
    }
}