import { render, Component } from "@wordpress/element";
import apiFetch from "@wordpress/api-fetch";
import { Row, Col, Container } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

import Results from "./Results.js";
import TaxBrowser from "./TaxBrowser.js";

class CtciSearch extends Component {
	constructor(props) {
		super(props);
		this.state = {
			searchContent: "",
			searchEndpoints: window.searchendpoints,
			customSearch: window.searchendpoints.custom,
			taxEndpoints: window.searchendpoints.taxonomies_endpoints,
			taxSearchBase: window.searchendpoints.taxonomy_custom,
			sitename: window.searchendpoints.sitename,
			years: Object.values(window.searchendpoints.years),
			restYears: [],
			searchResults: [],
			searchMessage: "",
			isSearching: false,
			isTermSearch: false,
			allowYearEnd: false,
			termSearch: "",
			taxSearch: "",
			startYear: "",
			endYear: "",
			resultsTitle: "",
		};

		this.clickTerm = this.clickTerm.bind(this);
	}

	componentDidMount() {
		//load data here
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

		if (this.state.startYear !== prevState.startYear) {
			let cutYear = this.state.years.indexOf(
				parseInt(this.state.startYear)
			);
			console.log(cutYear);
			this.setState({ restYears: this.state.years.slice(cutYear) });
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

		if (
			this.state.searchContent.length > 2 ||
			(this.state.searchContent.length == 0 &&
				this.state.startYear.length > 0)
		) {
			this.buildSearch();
			this.setState({ isSearching: true });
		}
	}

	buildSearch() {
		let baseUrl;
		let searchUrl;
		let searchString = encodeURI(this.state.searchContent);
		console.log(searchString);

		if (
			this.state.startYear &&
			this.state.endYear &&
			this.state.searchContent.length > 0
		) {
			baseUrl =
				this.state.searchEndpoints.custom +
				"?s=" +
				this.state.searchContent +
				"&startyear=" +
				this.state.startYear +
				"&endyear=" +
				this.state.endYear;
		} else if (this.state.startYear && this.state.endYear) {
			baseUrl =
				this.state.searchEndpoints.custom +
				"?startyear=" +
				this.state.startYear +
				"&endyear=" +
				this.state.endYear;
		} else if (
			this.state.searchContent.length > 0 &&
			this.state.startYear
		) {
			baseUrl =
				this.state.searchEndpoints.custom +
				"?s=" +
				this.state.searchContent +
				"&startyear=" +
				this.state.startYear;
		} else if (this.state.startYear) {
			baseUrl =
				this.state.searchEndpoints.custom +
				"?startyear=" +
				this.state.startYear;
		} else {
			baseUrl = this.state.searchEndpoints.custom + "?s=" + searchString;
		}

		console.log(baseUrl);

		apiFetch({ url: baseUrl }).then((items) => {
			console.log(items);

			let title =
				(items.length > 0 ? items.length : 0) +
				" resultado(s) " +
				(this.state.searchContent.length > 0
					? " para " + this.state.searchContent
					: "");
			let yearstart =
				this.state.startYear.length > 0
					? " [desde " + this.state.startYear
					: "";
			let yearend =
				this.state.endYear.length > 0
					? " hasta " + this.state.endYear + "]"
					: this.state.startYear.length > 0
					? "]"
					: "";

			this.setState({
				searchResults: items,
				resultsTitle: title + yearstart + yearend,
			});
		});
	}

	clickTerm(term) {
		console.log("clicked", term);
		this.setState({
			isTermSearch: true,
			isSearching: true,
		});
		let taxName = term.taxonomy === "post_tag" ? "tags" : term.taxonomy;
		let searchUrl =
			this.state.taxSearchBase +
			"?taxonomy=" +
			taxName +
			"&term=" +
			term.term_id;
		console.log(searchUrl);
		apiFetch({ url: searchUrl }).then((posts) => {
			console.log(posts);
			this.setState({
				searchResults: posts,
				searchContent: taxName + " " + term.name,
			});
		});
	}

	updateYearEnd(e) {
		console.log(e.target.value);
		this.setState({
			endYear: e.target.value,
		});
	}

	updateYearStart(e) {
		console.log(e.target.value);
		this.setState({
			startYear: e.target.value,
			endYear: "",
		});
	}

	render() {
		const yearOptions = this.state.years.map((year, idx) => (
			<option key={idx} value={year}>
				{year}
			</option>
		));
		const endYearOptions = this.state.restYears.map((year, idx) => (
			<option key={idx} value={year}>
				{year}
			</option>
		));

		return (
			<>
				<Container className={this.props.layout}>
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
									<div className="form-row">
										<div className="col">
											<input
												type="text"
												className="form-control"
												onChange={(e) =>
													this.updateSearch(e)
												}
												onSubmit={(e) =>
													this.doSearch(e)
												}
												value={this.state.value}
												placeholder="Buscar ..."
											/>
										</div>
									</div>
									<div className="form-row">
										<div className="col">
											<select
												value={this.state.startYear}
												className="custom-select"
												name="yearStart"
												id="yearStart"
												onChange={(e) =>
													this.updateYearStart(e)
												}
											>
												<option value={""}>
													{"desde Año"}
												</option>
												{yearOptions}
											</select>
										</div>
										{this.state.startYear &&
											this.state.allowYearEnd && (
												<div className="col">
													<select
														value={
															this.state.endYear
														}
														className="custom-select"
														name="yearEnd"
														id="yearEnd"
														onChange={(e) =>
															this.updateYearEnd(
																e
															)
														}
													>
														<option value={""}>
															{"hasta Año"}
														</option>
														{endYearOptions}
													</select>
												</div>
											)}
									</div>
									{this.state.startYear && (
										<div className="form-row">
											<div className="col">
												Escoger hasta{" "}
												<input
													type="checkbox"
													value={
														this.state.allowYearEnd
													}
													onChange={() =>
														this.setState({
															allowYearEnd: !this
																.state
																.allowYearEnd,
															endYear: "",
														})
													}
												/>
											</div>
										</div>
									)}
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
						title={this.state.resultsTitle}
						message={this.state.searchMessage}
						posts={this.state.searchResults}
					/>
				</Container>
				{this.state.searchResults.length === 0 &&
					this.props.layout !== "mini" && (
						<TaxBrowser
							onClickTerm={this.clickTerm}
							taxonomies={this.state.taxEndpoints}
						/>
					)}
			</>
		);
	}
}

const searchBox = document.getElementById("ctci_search");
const layout = searchBox.getAttribute("data-layout");

render(<CtciSearch layout={layout} />, searchBox);
