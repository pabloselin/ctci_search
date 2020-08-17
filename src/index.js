import { render, Component } from "@wordpress/element";
import apiFetch from "@wordpress/api-fetch";
import styled from "styled-components";

import Results from "./Results.js";
import TaxBrowser from "./TaxBrowser.js";

console.log("init search");

const SearchField = styled.form`
	margin-bottom: 24px;
	input[type="text"] {
		margin-right: 12px;
		padding: 6px;
	}
`;

const SearchZone = styled.div`
	padding: 24px;
	background-color: #f0f0f0;
	overflow: hidden;
	text-align: center;
`;

class CtciSearch extends Component {
	constructor(props) {
		super(props);

		this.state = {
			searchContent: "",
			searchEndpoints: window.searchendpoints,
			taxEndpoints: window.searchendpoints.taxonomies_endpoints,
			taxSearchBase: window.searchendpoints.taxonomy_base,
			searchResults: [],
			searchMessage: "Buscar recursos",
			isSearching: false,
			isTermSearch: false,
			termSearch: "",
			taxSearch: "",
		};

		this.clickTerm = this.clickTerm.bind(this);
	}

	componentDidMount() {
		//load data here
		console.log(this.state.searchEndpoints);
	}

	componentDidUpdate(prevProps, prevState) {
		if (this.state.searchResults !== prevState.searchResults) {
			this.setState({
				isSearching: false,
			});
			if (this.state.searchResults.length > 0) {
				this.setState({ searchMessage: "" });
			} else {
				this.setState({
					searchMessage: "No se encontraron contenidos",
				});
			}
		}
	}

	updateSearch(e) {
		console.log(e.target.value);
		this.setState({
			searchContent: e.target.value,
		});
	}

	doSearch(e) {
		e.preventDefault();
		this.setState({ isSearching: true });
		let searchUrl =
			this.state.searchEndpoints.default + this.state.searchContent;
		apiFetch({ url: searchUrl }).then((posts) => {
			console.log(posts);
			this.setState({ searchResults: posts });
		});
	}

	clickTerm(term) {
		console.log("clicked", term);
		this.setState({
			isTermSearch: true,
			isSearching: true,
		});
		let taxName = term.taxonomy === "post_tag" ? "tags" : term.taxonomy;
		let searchUrl = this.state.taxSearchBase + taxName + "=" + term.term_id;
		console.log(searchUrl);
		apiFetch({ url: searchUrl }).then((posts) => {
			console.log(posts);
			this.setState({ searchResults: posts });
		});
	}

	render() {
		return (
			<SearchZone>
				<SearchField onSubmit={(e) => this.doSearch(e)}>
					<input
						type="text"
						onChange={(e) => this.updateSearch(e)}
						onSubmit={(e) => this.doSearch(e)}
						value={this.state.value}
					/>
					<input type="submit" value="Buscar" />
				</SearchField>

				<Results
					isSearching={this.state.isSearching}
					searchQuery={this.state.searchContent}
					message={this.state.searchMessage}
					posts={this.state.searchResults}
				/>
				<TaxBrowser
					onClickTerm={this.clickTerm}
					taxonomies={this.state.taxEndpoints}
				/>
			</SearchZone>
		);
	}
}

render(<CtciSearch />, document.getElementById("ctci_search"));
