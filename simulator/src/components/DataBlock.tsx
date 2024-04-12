import {Component} from "react";
import Bit from "./Bit";

export default class DataBlock<Type extends string> extends Component<{values: Array<Type>}> {
    render() {
        return (
            <div className={"border border-gray-400 rounded p-2 inline-block"}>
                {this.props.values.map((value) => <Bit value={value}/>)}
            </div>
        );
    }
}