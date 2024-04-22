import {useState} from "react";

const Select = (props) => {
    const {defaultValue, options, onChange, style, disabled} = props
    const [selected, setSelected] = useState(options.findIndex(option => option === defaultValue))

    return (
        <select disabled={disabled!==null ? disabled : false} style={style} value={selected} onChange={event => {
            setSelected(event.target.value)
            onChange(options[event.target.value])
        }}>
            {
                options.map((option, index) => {
                    return <option key={index} value={index}>{option.name}</option>
                })
            }
        </select>
    )
}
export default Select