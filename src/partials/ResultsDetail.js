const ResultsDetail = (props) => {
	return (
		<>
			{props.content ? (
				<p>
					{props.label}: <strong>{props.content}</strong>
				</p>
			) : null}
		</>
	);
};

export default ResultsDetail;
