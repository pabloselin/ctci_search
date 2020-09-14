import { render, Component } from "@wordpress/element";

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
					<img src={this.props.image} alt={this.props.title} />
				) : (
					<div className="placeholder"></div>
				)}

				<div className="docText">
					<h1>
						<a href={this.props.link}>{this.props.title}</a>
					</h1>
					<DocDate date={this.props.date} />
					<div
						className="content"
						dangerouslySetInnerHTML={{ __html: this.props.excerpt }}
					/>
				</div>
			</article>
		);
	}
}

export default DocItem;
