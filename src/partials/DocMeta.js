import { render, Component } from "@wordpress/elements";

const monthEquiv = {
	"01": "Enero",
	"02": "Febrero",
	"03": "Marzo",
	"04": "Abril",
	"05": "Mayo",
	"06": "Junio",
	"07": "Julio",
	"08": "Agosto",
	"09": "Septiembre",
	"10": "Octubre",
	"11": "Noviembre",
	"12": "Diciembre",
};

const DocMeta = (props) => {
	return (
		<div className="DocMeta">
			{props.meta._ctci_doc_day ? (
				<span className="date">
					{props.meta._ctci_doc_day}{" "}
					{monthEquiv[props.meta._ctci_doc_month]}{" "}
					{props.meta._ctci_doc_year}
				</span>
			) : (
				<span className="date">
					{monthEquiv[props.meta._ctci_doc_month]}{" "}
					{props.meta._ctci_doc_year}
				</span>
			)}
		</div>
	);
};

export default DocMeta;
