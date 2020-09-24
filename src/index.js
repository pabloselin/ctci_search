import { render, Component } from "@wordpress/element";
import apiFetch from "@wordpress/api-fetch";
import queryString from "query-string";
import { Row, Col, Container } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faTimes } from "@fortawesome/free-solid-svg-icons";

import Results from "./Results.js";
import TaxBrowser from "./TaxBrowser.js";
import SelectTerm from "./partials/SelectTerm.js";
import SelectYear from "./partials/SelectYear.js";
import ChangeYear from "./partials/ChangeYear.js";

class CtciSearch extends Component {
	constructor(props) {
		super(props);

		let initialState = this.emptySearch();

		this.state = {
			searchEndpoints: window.searchendpoints,
			customSearch: window.searchendpoints.custom,
			taxEndpoints: window.searchendpoints.taxonomies_endpoints,
			taxSearchBase: window.searchendpoints.taxonomy_custom,
			taxLabels: window.searchendpoints.taxonomy_labels,
			sitename: window.searchendpoints.sitename,
			years: Object.values(window.searchendpoints.years),
			selectedTerms: window.searchendpoints.terms_home,
			layout: "mini",
			searchUrl: window.location.search,
			...initialState,
		};

		//this.searchTerm = this.searchTerm.bind(this);
		this.cleanSearch = this.cleanSearch.bind(this);
		this.switchTerm = this.switchTerm.bind(this);
		this.buttonTerm = this.buttonTerm.bind(this);
	}

	emptySearch() {
		return {
			resultsTitle: "",
			searchResults: [],
			searchMessage: "",
			restYears: [],
			isSearching: false,
			isTermSearch: false,
			allowYearEnd: false,
			s_content: "",
			s_docarea: undefined,
			s_doctype: undefined,
			s_doctema: undefined,
			s_docpilar: undefined,
			s_docauthor: undefined,
			s_post_tag: undefined,
			s_startyear: undefined,
			s_endyear: undefined,
		};
	}

	cleanSearch() {
		let emptySearch = this.emptySearch();

		this.setState({ ...emptySearch });
	}

	hasSearch() {
		let hasSearch = false;

		if (
			this.state.s_content ||
			this.state.s_docarea ||
			this.state.s_doctype ||
			this.state.s_doctema ||
			this.state.s_docpilar ||
			this.state.s_docauthor ||
			this.state.s_post_tag ||
			this.state.s_startyear ||
			this.state.s_endyear
		) {
			hasSearch = true;
		}

		return hasSearch;
	}

	componentDidMount() {
		//load data here
		this.setState({
			layout: this.props.layout,
		});

		let tmpstate = {};

		if (this.state.searchUrl) {
			let parsedQuery = queryString.parse(this.state.searchUrl);

			if (parsedQuery.content) {
				tmpstate["s_content"] = parsedQuery.content;
			}
		}

		this.setState(tmpstate);
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
			(this.state.layout == "expanded" &&
				this.state.s_startyear !== prevState.s_startyear) ||
			this.state.s_doctype !== prevState.s_doctype ||
			this.state.s_docarea !== prevState.s_docarea ||
			this.state.s_doctema !== prevState.s_doctema ||
			this.state.s_docpilar !== prevState.s_docpilar ||
			this.state.s_docauthor !== prevState.s_docauthor ||
			(this.state.s_content !== prevState.s_content &&
				this.state.s_content.length > 5)
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

	buildSearchUrl() {
		let baseurl = this.state.customSearch;

		this.setState({
			isSearching: true,
			layout: "mini",
		});
		let queryObj = {
			content: this.state.s_content,
			docarea: this.state.s_docarea
				? this.state.s_docarea.term_id
				: undefined,
			doctype: this.state.s_doctype
				? this.state.s_doctype.term_id
				: undefined,
			doctema: this.state.s_doctema
				? this.state.s_doctema.term_id
				: undefined,
			docauthor: this.state.s_docauthor
				? this.state.s_docauthor.term_id
				: undefined,
			docpilar: this.state.s_docpilar
				? this.state.s_docpilar.term_id
				: undefined,
			post_tag: this.state.s_post_tag
				? this.state.s_post_tag.term_id
				: undefined,
			start_year: this.state.s_startyear,
			end_year: this.state.s_endyear,
		};
		let query = queryString.stringify(queryObj, {
			skipNull: true,
		});

		console.log(query);
		apiFetch({ url: this.state.customSearch + "?" + query }).then(
			(response) => {
				//console.log(posts);
				this.setState({
					searchResults: response.items,
					isSearching: false,
					title: response.title,
				});
			}
		);
	}

	switchTerm(term, taxonomy) {
		let terminfo = {
			term_id: term.value,
			term_name: term.label,
		};

		this.setState({
			["s_" + taxonomy]: terminfo,
		});
	}

	buttonTerm(menuitem) {
		console.log(menuitem);
		let term = {
			value: menuitem.term_id,
			label: menuitem.name,
		};

		this.switchTerm(term, menuitem.taxonomy);
	}

	updateYearEnd(e) {
		//console.log(e.target.value);
		this.setState({ s_endyear: e.value });
	}

	updateYearStart(e) {
		this.setState({ s_startyear: e.value, s_endyear: null });
	}

	render() {
		

		const AltChangeYear = (
			<ChangeYear
				changeYearStart={(e) => this.updateYearStart(e)}
				changeYearEnd={(e)=> this.updateYearEnd(e)}
				years={this.state.years}
				restYears={this.state.restYears}
				startyear={this.state.s_startyear}
				endyear={this.state.s_endyear}
				allowYearEnd={this.state.allowYearEnd}
				setAllowEnd={() =>
					this.setState({
						allowYearEnd: !this.state.allowYearEnd,
						s_endyear: undefined,
					})
				}
			/>
		);

		

		return (
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
											onSubmit={(e) => this.doSearch(e)}
											value={this.state.s_content}
											placeholder="Buscar ..."
										/>
									</Col>
									

									{this.hasSearch() &&
										this.state.layout == "mini" && (
											<Col className="colclean">
												<button
													type="button"
													value="Limpiar"
													className="cleanButton btn btn-large"
													onClick={this.cleanSearch}
												>
													Limpiar{" "}
													<FontAwesomeIcon
														icon={faTimes}
													/>
												</button>
											</Col>
										)}
									<Col className="colsearchbutton">
										<button
											type="submit"
											value="Buscar"
											className="searchButton btn btn-large"
										>
											Buscar{" "}
											<FontAwesomeIcon icon={faSearch} />
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
						change={this.switchTerm}
						taxonomies={this.state.taxEndpoints}
						searchContent={this.state.s_content}
						doctype={this.state.s_doctype}
						docarea={this.state.s_docarea}
						docauthor={this.state.s_docauthor}
						doctema={this.state.s_doctema}
						post_tag={this.state.s_post_tag}
						docpilar={this.state.s_docpilar}
						changeYear={AltChangeYear}
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
											<SelectTerm
												taxonomy={term.taxonomy}
												change={this.switchTerm}
												name={`select-${term.slug}`}
												options={term.children}
												defaultLabel={`Buscar en ${term.name}`}
											/>
										</div>
									) : (
										<button
											className="searchTerm btn btn-outline-dark btn-lg btn-light"
											onClick={() =>
												this.buttonTerm(term)
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
						<Row>{AltChangeYear}</Row>
					</div>
				)}

				<Results
					isSearching={this.state.isSearching}
					message={this.state.searchMessage}
					posts={this.state.searchResults}
					title={this.state.title}
					searchQuery={this.state.s_content}
				/>
			</Container>
		);
	}
}

const searchBox = document.getElementById("ctci_search");
const layout = searchBox.getAttribute("data-layout");

render(<CtciSearch layout={layout} />, searchBox);
