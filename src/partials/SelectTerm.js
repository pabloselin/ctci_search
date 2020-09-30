import { render, Component } from "@wordpress/element";
import Select from "react-select";

import { selectTheme, selectStyle } from "./selectTheme.js";

class SelectTerm extends Component {
	constructor(props) {
		super(props);
		console.log(props);
		this.state = {
			options: null,
		};
	}

	componentDidMount() {
		let emptyLabel = this.props.taxname
			? "Buscar en " + this.props.taxname
			: "Buscar ...";
		let options = [{ value: undefined, label: emptyLabel }];

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
					<label className={this.props.value !== undefined ? 'wv' : 'nv'}>{this.props.taxname}</label>
					<Select
						className={
							this.props.value !== undefined
								? "withValue"
								: "withoutValue"
						}
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
