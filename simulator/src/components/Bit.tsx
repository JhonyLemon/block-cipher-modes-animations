import {Component} from "react";
import BinaryRepresentationHoverPopup from "./BinaryRepresentationHoverPopup";

export default class Bit<Type extends string> extends Component<{ value: Type }> {

    state = {
        isHovered: false,
        idPopupHovered: false
    };

    handleMouseEnter = () => {
        this.setState({ isHovered: true });
    };

    handleMouseLeave = () => {
        this.setState({ isHovered: false });
    };

    handlePopupMouseEnter = () => {
        this.setState({ idPopupHovered: true });
    };

    handlePopupMouseLeave = () => {
        this.setState({ idPopupHovered: false });
    };

    render() {

        return (
            <div className="relative inline-block">
                <div
                    className="text-center p-2 border border-gray-400 rounded cursor-pointer"
                    onMouseEnter={this.handleMouseEnter}
                    onMouseLeave={this.handleMouseLeave}
                >
                    {this.props.value}
                </div>
                {(this.state.isHovered || this.state.idPopupHovered) && <BinaryRepresentationHoverPopup value={this.props.value} onMouseEnter={this.handlePopupMouseEnter} onMouseLeave={this.handlePopupMouseLeave} />}
            </div>
        );
    }
}