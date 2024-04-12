import {Component} from "react";
import DataBlock from "./DataBlock";

export default class Data<Type extends string> extends Component<{values: Array<Type>, size: number}> {

    split() {
        const blocks: Array<Array<Type>> = new Array<Array<Type>>();
        for (let i = 0; i < this.props.values.length; i += this.props.size) {
            blocks.push(this.props.values.slice(i, i + this.props.size));
        }
        return blocks.reverse();
    }

    render() {
        return (
            <div className={"flex"}>
                {this.split().map((block)=> <DataBlock values={block}/>)}
            </div>
        );
    }
}