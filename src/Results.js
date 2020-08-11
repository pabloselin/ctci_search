import { render, Component } from "@wordpress/element";

import DocItem from "./DocItem.js";

class Results extends Component {
	constructor(props) {
		super();
	}

	componentDidMount() {}

	componentDidUpdate(prevProps) {
		if (this.props.posts !== prevProps.posts) {
			console.log(this.props.posts);
		}
	}

	render() {
		const docslist = (docs) => {
			if (docs.length > 0) {
				return docs.map((item) => <DocItem key={item.id} {...item} />);
			} else {
				return "Buscar recursos";
			}
		};

		return <div className="results">{docslist(this.props.posts)}</div>;
	}
}

export default Results;
