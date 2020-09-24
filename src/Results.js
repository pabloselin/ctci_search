import { render, Component } from "@wordpress/element";
import Loader from "react-loader-spinner";

import DocItem from "./DocItem.js";

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
								<h3 className="resultsTitle">
									{this.props.title.count} documentos
								</h3>
								<div className="resultsDetail">
									{this.props.title.searchcontent && (
										<p>
											Con palabra clave:{" "}
											<strong>
												{this.props.title.searchcontent}
											</strong>
										</p>
									)}
									<p className="yearRange">
										{this.props.title.start_year && (
											<span>
												desde{" "}
												{this.props.title.start_year}
											</span>
										)}
										{this.props.title.end_year && (
											<span>
												hasta{" "}
												{this.props.title.end_year}
											</span>
										)}
									</p>

									{this.props.title.terms && (
										<>
											{" "}
											{this.props.title.terms.doctype && (
												<p>
													Tipo de documento:{" "}
													<strong>
														{
															this.props.title
																.terms.doctype
														}
													</strong>
												</p>
											)}
											{this.props.title.terms.docarea && (
												<p>
													Área:{" "}
													<strong>
														{
															this.props.title
																.terms.docarea
														}
													</strong>
												</p>
											)}
											{this.props.title.terms
												.docauthor && (
												<p>
													Autor:{" "}
													<strong>
														{
															this.props.title
																.terms.docauthor
														}
													</strong>
												</p>
											)}
											{this.props.title.terms.doctema && (
												<p>
													Tema:{" "}
													<strong>
														{
															this.props.title
																.terms.doctema
														}
													</strong>
												</p>
											)}
											{this.props.title.terms
												.docpilar && (
												<p>
													Pilar Estratégico:{" "}
													<strong>
														{
															this.props.title
																.terms.docpilar
														}
													</strong>
												</p>
											)}
											{this.props.title.terms
												.post_tag && (
												<p>
													Etiqueta:{" "}
													<strong>
														{
															this.props.title
																.terms.post_tag
														}
													</strong>
												</p>
											)}
										</>
									)}
								</div>
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
