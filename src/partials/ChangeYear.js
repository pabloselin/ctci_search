import { Col, Row } from "react-bootstrap";
import SelectYear from "./SelectYear.js";

const ChangeYear = (props) => {
	return (
		<Col className="years-selects form-row">
			<Row>
				<Col>
					<SelectYear
						change={props.changeYearStart}
						options={props.years}
						name="yearStart"
						id="yearStart"
						label="Desde"
						value={props.startyear}
					/>
				</Col>
				{props.startyear && props.allowYearEnd && (
					<Col>
						<SelectYear
							change={props.changeYearEnd}
							name="yearEnd"
							id="yearEnd"
							label="Hasta"
							options={props.restYears}
							value={props.endyear}
						/>
					</Col>
				)}
			</Row>
			{props.startyear && (
				<Row>
					<input
						className="form-check-input"
						name="allowYearEnd"
						id="allowYearEnd"
						type="checkbox"
						value={props.allowYearEnd}
						onChange={props.setAllowEnd}
					/>
					<label htmlFor="allowYearEnd" className="form-check-label">
						Escoger hasta
					</label>
				</Row>
			)}
		</Col>
	);
};

export default ChangeYear;
