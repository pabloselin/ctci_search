import { render, Component } from "@wordpress/element";
import apiFetch from "@wordpress/api-fetch";
import { Row, Col, Container } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

import Results from "./Results.js";
import TaxBrowser from "./TaxBrowser.js";

console.log("init search");

class CtciSearch extends Component {
	constructor(props) {
		super(props);

		this.state = {
			searchContent: "",
			searchEndpoints: window.searchendpoints,
			taxEndpoints: window.searchendpoints.taxonomies_endpoints,
			taxSearchBase: window.searchendpoints.taxonomy_base,
			sitename: window.searchendpoints.sitename,
			searchResults: [],
			searchMessage: "",
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
			<>
				<Container>
					<div className="SearchZone">
						<form
							className="SearchField form"
							onSubmit={(e) => this.doSearch(e)}
						>
							<Row>
								<Col md="6" className="searchInfo">
									{this.state.sitename}
								</Col>
								<Col className="searchZone">
									<input
										type="text"
										className="form-control"
										onChange={(e) => this.updateSearch(e)}
										onSubmit={(e) => this.doSearch(e)}
										value={this.state.value}
										placeholder="Buscar ..."
									/>
									<button
										type="submit"
										value="Buscar"
										className="searchButton btn btn-large"
									>
										Buscar{" "}
										<FontAwesomeIcon icon={faSearch} />
									</button>
								</Col>
							</Row>
						</form>
					</div>

					<Results
						isSearching={this.state.isSearching}
						searchQuery={this.state.searchContent}
						message={this.state.searchMessage}
						posts={this.state.searchResults}
					/>
				</Container>
				{this.state.searchResults.length === 0 && (
					<TaxBrowser
						onClickTerm={this.clickTerm}
						taxonomies={this.state.taxEndpoints}
					/>
				)}
			</>
		);
	}
}

render(<CtciSearch />, document.getElementById("ctci_search"));
