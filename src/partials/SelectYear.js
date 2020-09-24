import { render, Component } from "@wordpress/element";
import Select from "react-select";

class SelectYear extends Component {
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
				<label>{this.props.label}</label>
				<Select
					onChange={(e) => this.props.change(e)}
					options={this.state.options}
					value={{
						label: this.props.value,
						label: this.props.value ? this.props.value : "Año",
					}}
				/>
				</>
			)
		);
	}
}

export default SelectYear;
