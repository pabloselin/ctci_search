import { render, Component } from "@wordpress/element";

import DocMeta from "./partials/DocMeta.js";

class DocItem extends Component {
	constructor(props) {
		super(props);
		this.state = {
			excerpt: { __html: "" },
			imageUrl: "",
			docarea: null,
			docauthor: null,
			docpilar: null,
			doctema: null,
			doctype: null,
			tags: null,
		};
	}

	componentDidMount() {
		this.setState({
			excerpt: { __html: this.props.excerpt.rendered },
			imageUrl: this.props.fimg_url,
			terms: {
				docarea: this.props.termlist.docarea,
				docauthor: this.props.termlist.docauthor,
				docpilar: this.props.termlist.docpilar,
				doctema: this.props.termlist.doctema,
				doctype: this.props.termlist.doctype,
				tags: this.props.termlist.post_tag,
			},
		});
	}

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
				{this.state.imageUrl ? (
					<img
						src={this.state.imageUrl}
						alt={this.props.title.rendered}
					/>
				) : (
					<div className="placeholder"></div>
				)}

				<div className="docText">
					<h1>
						<a href={this.props.link}>
							{this.props.title.rendered}
						</a>
					</h1>
					<DocMeta meta={this.props.meta} />
					<div
						className="content"
						dangerouslySetInnerHTML={this.state.excerpt}
					/>
				</div>
			</article>
		);
	}
}

export default DocItem;
