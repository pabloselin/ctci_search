import { Component } from "@wordpress/element";
import apiFetch from "@wordpress/api-fetch";
import { Row, Col, Container } from "react-bootstrap";

class TaxBrowser extends Component {
	constructor(props) {
		super(props);
		this.state = {
			curtax: "",
			taxonomies: null,
			curselection: "",
		};
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

	handleChange(e) {
		let info = e.target.value.split(",");

		if (info.length > 2) {
			console.log("handlechange in taxbrowser");
			this.setState({ curtax: info[1], curselection: e.target.value });
			this.props.onChangeTerm(e.target.value);
		}
	}

	componentDidUpdate(prevProps, prevState) {}

	render() {
		const taxlist = this.state.taxonomies
			? this.state.taxonomies.map((taxonomy, k) => (
					<Col key={k}>
						<h3>{taxonomy.labels.name}</h3>

						<select
							className="custom-select"
							onChange={(e) => this.handleChange(e)}
							name={`select-${taxonomy.slug}`}
							//value={this.state.curselection}
						>
							<option value="">Buscar en {taxonomy.labels.name}</option>
							{taxonomy.terms.length > 0 &&
								taxonomy.terms.map((term, k) => (
									<option
										value={
											term.term_id +
											"," +
											taxonomy.slug +
											"," +
											term.name
										}
										className="term"
										key={k}
									>
										{term.name}
									</option>
								))}
						</select>
					</Col>
			  ))
			: null;

		return (
			<div className="TaxBrowser">
				{this.props.layout === "expanded" && (
					<h2 className="taxbrowserTitle">o explora por &hellip;</h2>
				)}
				<Row>{taxlist}</Row>
			</div>
		);
	}
}

export default TaxBrowser;
