import { Col, Row } from "react-bootstrap";
import SelectYear from "./SelectYear.js";

const ChangeYear = (props) => {
	return (
		<>
			<Col>
				<SelectYear
					change={props.changeYearStart}
					options={props.years}
					name="yearStart"
					id="yearStart"
					label={props.labelStart}
					value={props.startyear}
				/>
				{props.startyear && (
					<div className="yearTo">
						<input
							className="form-check-input"
							name="allowYearEnd"
							id="allowYearEnd"
							type="checkbox"
							value={props.allowYearEnd}
							onChange={props.setAllowEnd}
						/>
						<label
							htmlFor="allowYearEnd"
							className="form-check-label"
						>
							Escoger hasta
						</label>
					</div>
				)}
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
		</>
	);
};

export default ChangeYear;
