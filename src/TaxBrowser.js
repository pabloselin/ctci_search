import { Component } from "@wordpress/element";
import apiFetch from "@wordpress/api-fetch";

class TaxBrowser extends Component {
	constructor(props) {
		super(props);
		this.state = {
			curtax: "",
		};
	}

	componentDidMount() {}

	componentDidUpdate(prevProps) {}

	render() {
		const taxlist = this.props.taxonomies.map((taxonomy, k) => (
			<div className={taxonomy.name} key={k}>
				<p>{taxonomy.labels.name}</p>
				<ul>
					{taxonomy.terms &&
						taxonomy.terms.map((term, k) => (
							<li
								className="term"
								onClick={() => this.props.onClickTerm(term)}
								key={k}
							>
								{term.name}
							</li>
						))}
				</ul>
			</div>
		));

		return <div className="TaxBrowser">{taxlist}</div>;
	}
}

export default TaxBrowser;
