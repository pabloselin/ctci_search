import { render, Component } from "@wordpress/element";
import Loader from "react-loader-spinner";

import DocItem from "./DocItem.js";

class Results extends Component {
	constructor(props) {
		super();
	}

	componentDidMount() {}

	componentDidUpdate(prevProps) {}

	render() {
		const docslist = (docs) => {
			if (docs.length > 0) {
				return docs.map((item) => <DocItem searchQuery={this.props.searchQuery} key={item.id} {...item} />);
			} else {
				return <p className="searchMessage">{this.props.message}</p>;
			}
		};

		return (
			<div className="results">
				{this.props.isSearching === true ? (
					<Loader
						type="Grid"
						color="#000000"
						height={100}
						width={100}
					/>
				) : (
					<>
						<h3>{this.props.title}</h3>

						{docslist(this.props.posts)}
					</>
				)}
			</div>
		);
	}
}

export default Results;
