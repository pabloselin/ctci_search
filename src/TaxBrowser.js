import { Component } from "@wordpress/element";
import apiFetch from "@wordpress/api-fetch";
import { Row, Col, Container } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronUp, faChevronDown } from "@fortawesome/free-solid-svg-icons";

import {
	BrowserView,
	MobileView,
	isMobile,
	isBrowser,
} from "react-device-detect";

import SelectTerm from "./partials/SelectTerm.js";
import ResultsTitle from "./partials/ResultsTitle.js";

class TaxBrowser extends Component {
	constructor(props) {
		super(props);
		this.state = {
			showFilters: true,
		};

		this.showFilters = this.showFilters.bind(this);
	}

	componentDidMount() {
		let tmptax = [];

		if (isMobile) {
			this.setState({
				showFilters: false,
			});
		}

		this.props.taxonomies.map((taxonomy) => {
			if (taxonomy.terms.length === undefined) {
				tmptax.push({
					labels: taxonomy.labels,
					terms: Object.values(taxonomy.terms),
					slug: taxonomy.name,
				});
			} else {
				tmptax.push({
					labels: taxonomy.labels,
					terms: taxonomy.terms,
					slug: taxonomy.name,
				});
			}
		});

		this.setState({ taxonomies: tmptax });
	}

	componentDidUpdate(prevProps, prevState) {}

	showFilters() {
		this.setState({
			showFilters: !this.state.showFilters,
		});
	}

	render() {
		const taxlist = this.state.taxonomies
			? this.state.taxonomies.map((taxonomy, k) => (
					<Col xs={12} md={2} key={k}>
						<SelectTerm
							taxonomy={taxonomy.slug}
							taxname={taxonomy.labels.name}
							change={(e) => this.props.change(e, taxonomy.slug)}
							name={`select-${taxonomy.slug}`}
							options={taxonomy.terms}
							defaultLabel={`Buscar en ${taxonomy.labels.name}`}
							value={this.props[taxonomy.slug]}
						/>
					</Col>
			  ))
			: null;

		return (
			<div className="TaxBrowser">
				<MobileView>
					{this.props.title && (
						<ResultsTitle
							isSearching={this.props.isSearching}
							title={this.props.title}
						/>
					)}

					<p className="toggleFilters" onClick={this.showFilters}>
						{this.state.showFilters
							? "Ocultar filtros "
							: "Mostrar filtros "}
						<FontAwesomeIcon
							icon={
								this.state.showFilters
									? faChevronUp
									: faChevronDown
							}
						/>
					</p>
				</MobileView>
				{this.state.showFilters && (
					<Row>
						{this.props.title && isBrowser && (
							<Col xs={12} md={2} className="titleZone">
								<ResultsTitle
									isSearching={this.props.isSearching}
									title={this.props.title}
								/>
							</Col>
						)}

						{this.props.changeYear}
						{taxlist}
					</Row>
				)}
			</div>
		);
	}
}

export default TaxBrowser;
