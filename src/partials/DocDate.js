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

const DocDate = (props) => {
	return (
		<div className="DocMeta">
			<span className="date">{props.date.year}</span>
		</div>
	);
};

export default DocDate;
