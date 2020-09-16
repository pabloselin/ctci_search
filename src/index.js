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
			taxLabels: window.searchendpoints.taxonomy_labels,
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
			layout: "mini",
		};

		//this.clickTerm = this.clickTerm.bind(this);
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
			this.setState({ isSearching: true, layout: "mini" });
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
				isSearching: false,
			});
		});
	}

	changeTerm(taxterm) {
		//console.log(taxterm[0]);
		const info = taxterm.split(",");
		console.log(info.length);

		if (info.length === 3) {
			this.setState({
				isTermSearch: true,
				isSearching: true,
			});
			let taxonomy = info[1];
			let term = info[0];
			let termname = info[2];

			let taxName = taxonomy === "post_tag" ? "tags" : taxonomy;
			console.log(taxName);
			let searchUrl =
				this.state.taxSearchBase +
				"?taxonomy=" +
				taxName +
				"&term=" +
				term;

			apiFetch({ url: searchUrl }).then((posts) => {
				this.setState({
					searchResults: posts,
					resultsTitle:
						this.state.taxLabels[taxName].name + ": " + termname,
					layout: "mini"
				});
			});
		}
	}

	updateYearEnd(e) {
		this.setState({
			endYear: e.target.value,
		});
	}

	updateYearStart(e) {
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

					<TaxBrowser
						layout={this.state.layout}
						onChangeTerm={(e) => this.changeTerm(e)}
						taxonomies={this.state.taxEndpoints}
						searchContent={this.state.searchContent}
					/>

					<Results
						isSearching={this.state.isSearching}
						searchQuery={this.state.searchContent}
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
