import { Component } from "@wordpress/element";
import ResultsDetail from "./ResultsDetail.js";

class ResultsTitle extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<>
				{!this.props.isSearching ? (
					<>
						<h3 className="numberResults">
							{this.props.title.count} documento(s)
						</h3>
						<div className="resultsDetail">
							<ResultsDetail
								content={this.props.title.searchcontent}
								label={"Con palabra clave "}
							/>
							{this.props.title.start_year && (
								<p className="yearRange">
									{this.props.title.start_year && (
										<span>
											desde{" "}
											<strong>
												{this.props.title.start_year}
											</strong>
										</span>
									)}
									{this.props.title.end_year && (
										<span>
											hasta{" "}
											<strong>
												{this.props.title.end_year}
											</strong>
										</span>
									)}
								</p>
							)}

							{this.props.title.terms && (
								<>
									<ResultsDetail
										content={this.props.title.terms.doctype}
										label={"Tipo de documento"}
									/>
									<ResultsDetail
										content={this.props.title.terms.docarea}
										label={"Área"}
									/>
									<ResultsDetail
										content={
											this.props.title.terms.docauthor
										}
										label={"Autor"}
									/>
									<ResultsDetail
										content={this.props.title.terms.doctema}
										label={"Tema"}
									/>
									<ResultsDetail
										content={
											this.props.title.terms.docpilar
										}
										label={"Pilar Estratégico"}
									/>
									<ResultsDetail
										content={
											this.props.title.terms.post_tag
										}
										label={"Etiqueta"}
									/>
								</>
							)}
						</div>
					</>
				) : (
					<>
						<h3 className="numberResults searching">
							Buscando documentos ...
						</h3>
					</>
				)}
			</>
		);
	}
}

export default ResultsTitle;
