import {useState} from "react";

const Select = ({options, defaultSelected, style, disabled, onChange}) => {
    const [selected, setSelected] = useState(Object.keys(options)[defaultSelected]);

    const componentsOptions = Object.keys(options).map((key) =>
        <option key={key} value={key}>{options[key].name}</option>
    );

    return (
        <select disabled={disabled!==null ? disabled : false} style={style} value={selected} onChange={event => {
            setSelected(event.target.value)
            onChange(options[event.target.value])
        }}>
            {
                componentsOptions
            }
        </select>
    )
}
export default Select