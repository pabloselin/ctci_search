import { render, Component } from "@wordpress/element";
import Loader from "react-loader-spinner";

import DocItem from "./DocItem.js";
import ResultsTitle from "./partials/ResultsTitle.js";

class Results extends Component {
	constructor(props) {
		super(props);

		this.state = {
			availableTerms: {
				docarea: [],
				docauthor: [],
				docpilar: [],
				doctema: [],
				doctype: [],
			},
		};
	}

	componentDidMount() {}

	componentDidUpdate(prevProps, prevState) {}

	render() {
		const docslist = (docs) => {
			if (docs.length > 0) {
				return docs.map((item) => (
					<DocItem
						searchQuery={this.props.searchQuery}
						key={item.id}
						{...item}
					/>
				));
			} else {
				return <p className="searchMessage">{this.props.message}</p>;
			}
		};

		const typebox =
			this.props.isSearching === true || this.props.posts.length > 0
				? "results withcontent"
				: "results empty";

		return (
			<div className={typebox}>
				{this.props.isSearching === true ? (
					<div className="loadingZone">
						<Loader
							type="Grid"
							color="#000000"
							height={100}
							width={100}
						/>
					</div>
				) : (
					<>
						{this.props.title && (
							<>
								<ResultsTitle title={this.props.title} />
							</>
						)}

						{docslist(this.props.posts)}
					</>
				)}
			</div>
		);
	}
}

export default Results;
