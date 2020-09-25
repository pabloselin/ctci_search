import { render, Component } from "@wordpress/element";
import Select from "react-select";

import {selectTheme, selectStyle} from "./selectTheme.js";

class SelectTerm extends Component {
	constructor(props) {
		super(props);
		console.log(props);
		this.state = {
			options: null,
		};
	}

	componentDidMount() {
		let options = [];

		if (this.props.options) {
			this.props.options.map((option) => {
				options.push({ value: option.term_id, label: option.name });
			});
			console.log(options);

			this.setState({
				options: options,
			});
		}
	}

	render() {
		return (
			this.state.options && (
				<>
					<label>{this.props.taxname}</label>
					<Select
						value={{
							label: this.props.value
								? this.props.value.term_name
								: this.props.defaultLabel,
							value: this.props.value
								? this.props.value.term_id
								: undefined,
						}}
						onChange={(e) =>
							this.props.change(e, this.props.taxonomy)
						}
						options={this.state.options}
						theme={(theme) => selectTheme(theme)}
						styles={selectStyle}
					/>
				</>
			)
		);
	}
}

export default SelectTerm;
