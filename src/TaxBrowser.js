import { Component } from "@wordpress/element";
import apiFetch from "@wordpress/api-fetch";
import { Row, Col, Container } from "react-bootstrap";
import SelectTerm from "./partials/SelectTerm.js";

class TaxBrowser extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	componentDidMount() {
		let tmptax = [];

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

	render() {
		const taxlist = this.state.taxonomies
			? this.state.taxonomies.map((taxonomy, k) => (
					<Col key={k}>
						<h3>{taxonomy.labels.name}</h3>
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
				{this.props.layout === "expanded" && (
					<h2 className="taxbrowserTitle">o explora por &hellip;</h2>
				)}
				<Row>
					{this.props.changeYear}
					{taxlist}
				</Row>
			</div>
		);
	}
}

export default TaxBrowser;
