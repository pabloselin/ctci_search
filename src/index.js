import { render, Component } from "@wordpress/element";
import apiFetch from "@wordpress/api-fetch";
import queryString from "query-string";
import { Row, Col, Container } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faTimes, faPlus } from "@fortawesome/free-solid-svg-icons";

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
			termLabels: window.searchendpoints.term_labels,
			sitename: window.searchendpoints.sitename,
			years: Object.values(window.searchendpoints.years),
			selectedTerms: window.searchendpoints.terms_home,
			layout: "mini",
			searchUrl: window.location.search,
			showOtherTaxonomies: false,
			isPrevSearch: false,
			...initialState,
		};

		//this.searchTerm = this.searchTerm.bind(this);
		this.cleanSearch = this.cleanSearch.bind(this);
		this.switchTerm = this.switchTerm.bind(this);
		this.buttonTerm = this.buttonTerm.bind(this);
		this.toggleExtraTaxonomies = this.toggleExtraTaxonomies.bind(this);
	}

	emptySearch() {
		return {
			searchResults: [],
			searchMessage: "",
			restYears: [],
			isSearching: false,
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

		this.processLocation();
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
			(this.state.s_content !== prevState.s_content &&
				this.state.isPrevSearch === true) ||
			this.state.s_startyear !== prevState.s_startyear ||
			this.state.s_endyear !== prevState.s_endyear ||
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

	buildSearchUrl() {
		let baseurl = this.state.customSearch;

		this.setState({
			isSearching: true,
			layout: "mini",
		});

		let query = this.buildQueryString();

		apiFetch({ url: this.state.customSearch + "?" + query }).then(
			(response) => {
				//console.log(posts);
				this.setState({
					searchResults: response.items,
					isSearching: false,
					title: response.title,
					isPrevSearch: false,
				});
			}
		);
	}

	buildQueryString() {
		let queryObj = {
			content: this.state.s_content ? this.state.s_content : "",
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
		window.history.pushState({ query: query }, "", "#/" + query);
		return query;
	}

	processLocation() {
		let locationHash = window.location.hash.substring(2);
		let parsed = queryString.parse(locationHash);

		if (parsed) {
			this.setState({
				s_content: parsed.content ? parsed.content : "",
				s_docarea: this.returnTermData("docarea", parsed.docarea),
				s_doctype: this.returnTermData("doctype", parsed.doctype),
				s_doctema: this.returnTermData("doctema", parsed.doctema),
				s_docauthor: this.returnTermData("docauthor", parsed.docauthor),
				s_docpilar: this.returnTermData("docpilar", parsed.docpilar),
				s_post_tag: this.returnTermData("post_tag", parsed.post_tag),
				s_startyear: parsed.start_year ? parsed.start_year : undefined,
				s_endyear: parsed.end_year ? parsed.end_year : undefined,
				isPrevSearch: true,
			});
		}

		console.log(parsed);
	}

	returnTermData(taxonomy, termid) {
		//devuelve el nombre del termino tambien sacado de algun lugar magico
		let termData = undefined;
		if (termid) {
			termData = {
				term_id: parseInt(termid),
				term_name: this.state.termLabels[taxonomy][termid],
			};
		}

		return termData;
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

	toggleLayout() {
		this.setState({ layout: "mini" });
	}

	toggleExtraTaxonomies() {
		this.setState({ showOtherTaxonomies: !this.state.showOtherTaxonomies });
	}

	render() {
		const AltChangeYear = (
			<ChangeYear
				changeYearStart={(e) => this.updateYearStart(e)}
				changeYearEnd={(e) => this.updateYearEnd(e)}
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
								<Row className="justify-content-md-center form-row">
									<Col md={5} className="mainSearchInput">
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
										{this.state.layout === "expanded" && (
											<span
												className="toggleLayout"
												onClick={() =>
													this.toggleLayout()
												}
											>
												Búsqueda avanzada
											</span>
										)}
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
								</Row>
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
						title={this.state.title}
						isSearching={this.state.isSearching}
					/>
				) : (
					<div className="TaxBrowserHome">
						<div className="filterHomeSection">
							<h2 className="taxbrowserTitle">
								o explora por &hellip;
							</h2>
							{this.state.showOtherTaxonomies ? (
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
									title={this.state.title}
									isSearching={this.state.isSearching}
									hideYears={true}
									hideDocType={true}
									inHome={true}
								/>
							) : (
								<Row>
									{this.state.selectedTerms.map(
										(term, key) => (
											<Col
												className="taxColHome"
												xs={12}
												md={4}
												key={key}
											>
												<h3 className="taxTitle">
													{term.name}
												</h3>
												<div className="termdesc">
													{term.description}
												</div>
												{term.children ? (
													<div>
														<SelectTerm
															taxonomy={
																term.taxonomy
															}
															change={
																this.switchTerm
															}
															name={`select-${term.slug}`}
															options={
																term.children
															}
															defaultLabel={`Buscar en ${term.name}`}
														/>
													</div>
												) : (
													<button
														className="searchTerm btn btn-lg btn-light"
														onClick={() =>
															this.buttonTerm(
																term
															)
														}
													>
														Buscar ...
													</button>
												)}
											</Col>
										)
									)}
								</Row>
							)}

							<div className="extraBrowser">
								<button
									className="btn btn-light"
									onClick={() => this.toggleExtraTaxonomies()}
								>
									<FontAwesomeIcon icon={this.state.showOtherTaxonomies ? faTimes : faPlus} /> Otras categorías
								</button>
							</div>
						</div>
						<div className="filterHomeSection">
							<Row>
								<Col>
									<h2 className="taxbrowserTitle">
										o por año ...
									</h2>
								</Col>
							</Row>
							<Row className="justify-content-md-center">
								<Col md={3}>{AltChangeYear}</Col>
							</Row>
						</div>
					</div>
				)}
				{this.state.layout === "mini" && (
					<Results
						isSearching={this.state.isSearching}
						message={this.state.searchMessage}
						posts={this.state.searchResults}
						searchQuery={this.state.s_content}
					/>
				)}
			</Container>
		);
	}
}

const searchBox = document.getElementById("ctci_search");

if (searchBox) {
	const layout = searchBox.getAttribute("data-layout");
	render(<CtciSearch layout={layout} />, searchBox);
}
