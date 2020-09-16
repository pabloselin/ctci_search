import { render, Component } from "@wordpress/element";
import Highlighter from "react-highlight-words";
import latinize from "latinize";

import DocDate from "./partials/DocDate.js";

class DocItem extends Component {
	constructor(props) {
		super(props);
	}

	componentDidMount() {}

	render() {
		const taxonomies = [
			{ docarea: "Área" },
			{ docauthor: "Autor" },
			{ docpilar: "Pilar Estratégico" },
			{ doctema: "Tema" },
			{ doctype: "Tipo" },
			{ tags: "Etiquetas" },
		];

		return (
			<article className="DocItem">
				{this.props.image ? (
					<a href={this.props.link}>
						<img src={this.props.image} alt={this.props.title} />
					</a>
				) : (
					<div className="placeholder"></div>
				)}

				<div className="docText">
					<h1>
						<a href={this.props.link}>
							<Highlighter
								sanitize={latinize}
								searchWords={[this.props.searchQuery]}
								textToHighlight={this.props.title}
							/>
						</a>
					</h1>
					<DocDate date={this.props.date} />
					<Highlighter
						sanitize={latinize}
						className="content"
						searchWords={[this.props.searchQuery]}
						textToHighlight={this.props.excerpt}
					/>

					<div className="docTerms">
					{this.props.terms.docarea.length > 0 &&
						this.props.terms.docarea.map((area) => (
							<span>{area.name}</span>
						))}

						{this.props.terms.docpilar.length > 0 &&
						this.props.terms.docpilar.map((area) => (
							<span>{area.name}</span>
						))}
					</div>
				</div>
			</article>
		);
	}
}

export default DocItem;
