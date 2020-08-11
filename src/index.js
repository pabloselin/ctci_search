import { render, Component } from "@wordpress/element";
import apiFetch from "@wordpress/api-fetch";

import Results from "./Results.js";

console.log("init search");

class CtciSearch extends Component {
	constructor(props) {
		super(props);

		this.state = {
			searchContent: "",
			searchEndpoints: window.searchendpoints,
			searchResults: [],
		};
	}

	componentDidMount() {
		//load data here
		console.log(this.state.searchEndpoints);
	}

	componentDidUpdate() {}

	updateSearch(e) {
		console.log(e.target.value);
		this.setState({
			searchContent: e.target.value,
		});
	}

	doSearch(e) {
		e.preventDefault();
		let searchUrl =
			this.state.searchEndpoints.default + this.state.searchContent;
		apiFetch({ url: searchUrl }).then((posts) => {
			console.log(posts);
			this.setState({ searchResults: posts });
		});
	}

	render() {
		return (
			<div id="ctci_search">
				<form onSubmit={(e) => this.doSearch(e)}>
					<input
						type="text"
						onChange={(e) => this.updateSearch(e)}
						onSubmit={(e) => this.doSearch(e)}
						value={this.state.value}
					/>
					<input type="submit" value="Buscar" />
				</form>

				<Results posts={this.state.searchResults} />
			</div>
		);
	}
}

render(<CtciSearch />, document.getElementById("ctci_search"));
