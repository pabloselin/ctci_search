import { render, Component } from "@wordpress/element";

class DocItem extends Component {
	constructor(props) {
		super(props);
		this.state = {
			excerpt: { __html: "" },
			imageUrl: "",
		};
	}

	componentDidMount() {
		this.setState({
			excerpt: { __html: this.props.excerpt.rendered },
			imageUrl: this.props._embedded["wp:featuredmedia"][0].source_url,
			terms: this.props._embedded["wp:term"],
		});
	}

	render() {
		return (
			<div className="docitem">
				<img
					src={this.state.imageUrl}
					alt={this.props.title.rendered}
				/>
				<h1>
					<a href={this.props.link}>{this.props.title.rendered}</a>
				</h1>
				<div
					className="content"
					dangerouslySetInnerHTML={this.state.excerpt}
				/>
			</div>
		);
	}
}

export default DocItem;
