import { Component } from "@wordpress/element";
import apiFetch from "@wordpress/api-fetch";

class TaxBrowser extends Component {
	constructor(props) {
		super(props);
		this.state = {
			curtax: "",
			taxonomies: null,
		};
	}

	componentDidMount() {
		let tmptax = [];
		this.props.taxonomies.map((taxonomy) => {
			if (taxonomy.terms.length === undefined) {
				tmptax.push({
					taxinfo: taxonomy.labels,
					terms: Object.values(taxonomy.terms),
				});
			} else {
				tmptax.push({
					taxinfo: taxonomy.labels,
					terms: taxonomy.terms,
				});
			}
		});

		this.setState({ taxonomies: tmptax });
	}

	componentDidUpdate(prevProps) {}

	render() {
		const taxlist = this.state.taxonomies
			? this.state.taxonomies.map((taxonomy, k) => (
					<div className={taxonomy.taxinfo.name} key={k}>
						<p>{taxonomy.taxinfo.name}</p>

						<ul>
							{taxonomy.terms.length > 0 ? (
								taxonomy.terms.map((term, k) => (
									<li
										className="term"
										onClick={() =>
											this.props.onClickTerm(term)
										}
										key={k}
									>
										{term.name}
									</li>
								))
							) : (
								<li
									className="term"
									onClick={() =>
										this.props.onClickTerm(
											taxonomy.terms.name
										)
									}
								>
									{taxonomy.terms.name}
								</li>
							)}
						</ul>
					</div>
			  ))
			: null;

		return <div className="TaxBrowser">{taxlist}</div>;
	}
}

export default TaxBrowser;
