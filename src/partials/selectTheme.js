const selectTheme = (theme) => ({
	...theme,
	borderRadius: 15,
	spacing: { baseUnit: 8 },
	colors: {
		...theme.colors,
		primary: '#777'
	}
});

const selectStyle = {
	dropdownIndicator: (provided, state) => ({
		...provided,
		color: "#333",
		"&:hover": {
			color: "#333",
		},
	}),
	indicatorSeparator: (provided, state) => ({
		...provided,
		display: 'none',
	}),
	indicatorsContainer: (provided, state) => ({
		...provided,
		"> div": {
			padding: 4
		}
	}),
	valueContainer: (provided, state) => ({
		...provided,
		padding: '4px 8px'
	}),
	control: (provided, state) => ({
		...provided,
		boxShadow: 0,
		"&:hover": {
			boxShadow: 0
		}
	}),
	option: (provided, state) => ({
		...provided,
		backgroundColor: 'transparent',
		"&:hover": {
			backgroundColor: '#f0f0f0'
		},
		color: state.selected ? '#333' : '#777'
	}),
	menu: (provided, state) => ({
		...provided,
		overflow: 'hidden'
	})
};

export { selectTheme, selectStyle };
