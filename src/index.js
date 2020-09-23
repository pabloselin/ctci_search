import { render, Component } from "@wordpress/element";
import apiFetch from "@wordpress/api-fetch";
import queryString from "query-string";
import { Row, Col, Container } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

import Results from "./Results.js";
import TaxBrowser from "./TaxBrowser.js";

class CtciSearch extends Component {
	constructor(props) {
		super(props);
		this.state = {
			searchEndpoints: window.searchendpoints,
			customSearch: window.searchendpoints.custom,
			taxEndpoints: window.searchendpoints.taxonomies_endpoints,
			taxSearchBase: window.searchendpoints.taxonomy_custom,
			taxLabels: window.searchendpoints.taxonomy_labels,
			sitename: window.searchendpoints.sitename,
			years: Object.values(window.searchendpoints.years),
			selectedTerms: window.searchendpoints.terms_home,
			restYears: [],
			searchResults: [],
			searchMessage: "",
			isSearching: false,
			isTermSearch: false,
			allowYearEnd: false,
			termSearch: "",
			taxSearch: "",
			resultsTitle: "",
			layout: "mini",

			s_content: null,
			s_docarea: null,
			s_doctype: null,
			s_doctema: null,
			s_docpilar: null,
			s_docauthor: null,
			s_post_tag: null,
			s_startyear: null,
			s_endyear: null,
		};

		this.searchTerm = this.searchTerm.bind(this);
	}

	componentDidMount() {
		//load data here
		this.setState({
			layout: this.props.layout,
		});
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

		if (this.state.s_startyear !== prevState.s_startyear) {
			let cutYear = this.state.years.indexOf(
				parseInt(this.state.s_startyear)
			);
			this.setState({ restYears: this.state.years.slice(cutYear) });
		}

		if (
			this.state.layout == "expanded" &&
			this.state.s_startyear !== prevState.s_startyear ||
			this.state.s_doctype !== prevState.s_doctype ||
			this.state.s_docarea !== prevState.s_docarea ||
			this.state.s_doctema !== prevState.s_doctema ||
			this.state.s_docpilar !== prevState.s_docpilar ||
			this.state.s_docauthor !== prevState.s_docauthor
		) {
			this.buildSearchUrl();
		}
	}

	updateSearch(e) {
		this.setState({ s_content: e.target.value });
	}

	doSearch(e) {
		e.preventDefault();
		this.buildSearchUrl();
	}

	buildSearch() {
		let baseUrl;
		let searchUrl;
		let searchString = encodeURI(this.state.s_content);
		console.log(searchString);
		this.setState({ isSearching: true, layout: "mini" });

		if (
			this.state.s_startyear &&
			this.state.s_endyear &&
			this.state.s_content.length > 0
		) {
			baseUrl =
				this.state.searchEndpoints.custom +
				"?s=" +
				this.state.s_content +
				"&startyear=" +
				this.state.s_startyear +
				"&endyear=" +
				this.state.s_endyear;
		} else if (this.state.s_startyear && this.state.s_endyear) {
			baseUrl =
				this.state.searchEndpoints.custom +
				"?startyear=" +
				this.state.s_startyear +
				"&endyear=" +
				this.state.s_endyear;
		} else if (this.state.s_content.length > 0 && this.state.s_startyear) {
			baseUrl =
				this.state.searchEndpoints.custom +
				"?s=" +
				this.state.s_content +
				"&startyear=" +
				this.state.s_startyear;
		} else if (this.state.s_startyear) {
			baseUrl =
				this.state.searchEndpoints.custom +
				"?startyear=" +
				this.state.s_startyear;
		} else {
			baseUrl = this.state.searchEndpoints.custom + "?s=" + searchString;
		}

		apiFetch({ url: baseUrl }).then((items) => {
			console.log(items);

			let title =
				(items.length > 0 ? items.length : 0) +
				" resultado(s) " +
				(this.state.s_content.length > 0
					? " para " + this.state.s_content
					: "");
			let yearstart =
				this.state.s_startyear.length > 0
					? " [desde " + this.state.s_startyear
					: "";
			let yearend =
				this.state.s_endyear.length > 0
					? " hasta " + this.state.s_endyear + "]"
					: this.state.s_startyear.length > 0
					? "]"
					: "";

			this.setState({
				searchResults: items,
				resultsTitle: title + yearstart + yearend,
				isSearching: false,
			});
		});
	}

	buildSearchUrl() {
		let baseurl = this.state.customSearch;

		this.setState({
			isSearching: true,
			layout: "mini",
		});
		let queryObj = {
				content: this.state.s_content,
				docarea: this.state.s_docarea,
				doctype: this.state.s_doctype,
				doctema: this.state.s_doctema,
				docauthor: this.state.s_docauthor,
				docpilar: this.state.s_docpilar,
				post_tag: this.state.s_post_tag,
				start_year: this.state.s_startyear,
				end_year: this.state.s_endyear,
			};
		let query = queryString.stringify(
			queryObj,
			{
				skipNull: true,
			}
		);

		console.log(query);
		apiFetch({ url: this.state.customSearch + "?" + query }).then(
			(posts) => {
				//console.log(posts);
				this.setState({
					searchResults: posts,
					isSearching: false,
					resultsTitle: this.buildResultsTitle(queryObj, posts.length),
				});
			}
		);
	}

	buildResultsTitle(query, number) {
		console.log(query)
		let title = "No se encontraron resultados";
		if (this.state.searchResults !== false) {
			title = number + " documentos";

			if (query.content) {
				title = `${title} para <strong>${query.content}<strong>`;
			}
		}

		return title;
	}

	changeTerm(taxterm) {
		const info = taxterm.split(",");

		if (info.length === 3) {
			this.setState({
				isTermSearch: true,
				isSearching: true,
			});
			let taxonomy = info[1];
			let term = info[0];
			let termname = info[2];

			this.setState({ ["s_" + taxonomy]: term });
		}
	}

	searchTerm(term) {
		this.setState({ ["s_" + term.taxonomy]: term.term_id });
	}

	updateYearEnd(e) {
		//console.log(e.target.value);
		this.setState({ s_endyear: e.target.value });
	}

	updateYearStart(e) {
		this.setState({ s_startyear: e.target.value, s_endyear: null });
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

		const YearSearch = (
			<Col>
				<div className="years-selects form-row">
					<Col>{"desde"}</Col>
					<Col>
						<select
							value={this.state.s_startyear}
							className="custom-select"
							name="yearStart"
							id="yearStart"
							onChange={(e) => this.updateYearStart(e)}
						>
							<option value={undefined}>{"escoger año"}</option>
							{yearOptions}
						</select>
					</Col>
					{this.state.s_startyear && this.state.allowYearEnd && (
						<Col>
							<select
								value={this.state.s_endyear}
								className="custom-select"
								name="yearEnd"
								id="yearEnd"
								onChange={(e) => this.updateYearEnd(e)}
							>
								<option value={undefined}>{"hasta Año"}</option>
								{endYearOptions}
							</select>
						</Col>
					)}
				</div>
				{this.state.s_startyear && (
					<div className="hastaInput">
						<Col>
							<div className="form-group form-check">
								<input
									className="form-check-input"
									name="allowYearEnd"
									id="allowYearEnd"
									type="checkbox"
									value={this.state.allowYearEnd}
									onChange={() =>
										this.setState({
											allowYearEnd: !this.state
												.allowYearEnd,
											s_endyear: undefined,
										})
									}
								/>
								<label
									htmlFor="allowYearEnd"
									className="form-check-label"
								>
									Escoger hasta
								</label>
							</div>
						</Col>
					</div>
				)}
			</Col>
		);

		return (
			<>
				<Container className={this.state.layout}>
					<div className="SearchZone">
						<form
							className="SearchField form"
							onSubmit={(e) => this.doSearch(e)}
						>
							{this.state.layout === "expanded" && (
								<Row>
									<Col>
										<h1 className="searchMainTitle">
											{this.state.sitename}
										</h1>
									</Col>
								</Row>
							)}

							<Row>
								{this.state.layout === "mini" && (
									<Col md="2" className="searchInfo">
										{this.state.sitename}
									</Col>
								)}

								<Col className="searchZone">
									<div className="form-row">
										<Col>
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
										</Col>
										{this.state.layout === "mini" &&
											YearSearch}
										<Col>
											<button
												type="submit"
												value="Buscar"
												className="searchButton btn btn-large"
											>
												Buscar{" "}
												<FontAwesomeIcon
													icon={faSearch}
												/>
											</button>
										</Col>
									</div>
								</Col>
							</Row>
						</form>
					</div>

					{this.state.layout === "mini" ? (
						<TaxBrowser
							layout={this.state.layout}
							onChangeTerm={(e) => this.changeTerm(e)}
							taxonomies={this.state.taxEndpoints}
							searchContent={this.state.s_content}
						/>
					) : (
						<div className="TaxBrowser TaxBrowserHome">
							<h2 className="taxbrowserTitle">
								o explora por &hellip;
							</h2>
							<Row>
								{this.state.selectedTerms.map((term, key) => (
									<Col key={key}>
										<h3>{term.name}</h3>
										<div className="termdesc">
											{term.description}
										</div>
										{term.children ? (
											<div>
												<select
													className="custom-select"
													onChange={(e) =>
														this.changeTerm(
															e.target.value
														)
													}
													name={`select-${term.slug}`}
												>
													<option value="">
														Buscar en {term.name}
													</option>
													{term.children.map(
														(child) => (
															<option
																value={
																	child.term_id +
																	"," +
																	child.taxonomy +
																	"," +
																	child.name
																}
															>
																{child.name}
															</option>
														)
													)}
												</select>
											</div>
										) : (
											<button
												className="searchTerm btn btn-outline-dark btn-lg btn-light"
												onClick={() =>
													this.searchTerm(term)
												}
											>
												Buscar ...
											</button>
										)}
									</Col>
								))}
							</Row>
							<Row>
								<Col>
									<h2 className="taxbrowserTitle">
										o por año ...
									</h2>
								</Col>
							</Row>
							<Row>{YearSearch}</Row>
						</div>
					)}

					<Results
						isSearching={this.state.isSearching}
						searchQuery={this.state.s_content}
						title={this.state.resultsTitle}
						message={this.state.searchMessage}
						posts={this.state.searchResults}
					/>
				</Container>
			</>
		);
	}
}

const searchBox = document.getElementById("ctci_search");
const layout = searchBox.getAttribute("data-layout");

render(<CtciSearch layout={layout} />, searchBox);
