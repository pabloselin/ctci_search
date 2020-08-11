import { render, Component } from "@wordpress/element";
import styled from "styled-components";

const StyledDocItem = styled.div`
	img {
		max-width: 200px;
		float: left;
		margin-right: 12px;
	}
`;

class DocItem extends Component {
	constructor(props) {
		super(props);
		this.state = {
			excerpt: { __html: "" },
			imageUrl: "",
			terms: [],
		};
	}

	componentDidMount() {
		this.setState({
			excerpt: { __html: this.props.excerpt.rendered },
			imageUrl: this.props.fimg_url,
		});
	}

	render() {
		return (
			<StyledDocItem>
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
				{this.state.terms &&
					this.state.terms.map((tax, index) => (
						<p key={index}>
							{tax.map((term) => (
								<span
									className={`termitem ` + term.taxonomy}
									key={term.id}
								>
									{term.name}
								</span>
							))}
						</p>
					))}
			</StyledDocItem>
		);
	}
}

export default DocItem;
