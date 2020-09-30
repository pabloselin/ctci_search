import { render, Component } from "@wordpress/element";
import Select from "react-select";

import { selectTheme, selectStyle } from "./selectTheme.js";

class SelectYear extends Component {
	constructor(props) {
		super(props);
		console.log(props);
		this.state = {
			options: null,
		};
	}

	componentDidMount() {
		let options = [{ value: undefined, label: "Todos" }];

		if (this.props.options) {
			this.props.options.map((option) =>
				options.push({ value: option, label: option })
			);
			this.setState({
				options: options,
			});
		}
	}

	render() {
		return (
			this.state.options && (
				<>
					<label
						className={this.props.value !== undefined ? "wv" : "nv"}
					>
						{this.props.label}
					</label>
					<Select
						className={
							this.props.value !== undefined
								? "withValue"
								: "withoutValue"
						}
						onChange={(e) => this.props.change(e)}
						options={this.state.options}
						value={{
							value: this.props.value,
							label: this.props.value
								? this.props.value
								: "Escoge año",
						}}
						theme={(theme) => selectTheme(theme)}
						styles={selectStyle}
					/>
				</>
			)
		);
	}
}

export default SelectYear;
