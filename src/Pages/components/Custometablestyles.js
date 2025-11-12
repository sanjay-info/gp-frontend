const customTableStyle = {
    table: {
        style: {
            border: "0px",
        },
    },
    tableWrapper: {
        style: {
            border: "0px"
        },
    },
    header: {
        style: {
            justifyContent: "space-between"
        },
    },
    headRow: {
        style: {
            borderWidth: "0px",
            paddingLeft: '35px',
            paddingRight: '35px',
            borderBottom: "1px solid #DBE1EF"

        },
    },
    headCells: {
        style: {
            fontWeight: "bold",
            fontSize: "15px",
            border: "none",
            width: "100%",
           backgroundColor:'pink'

        },
    },
    rows: {
        style: {
            borderWidth: "0.5px #E5E3E3",
            backgroundColor: "#ffffff !important",
            paddingLeft: '35px',
            paddingRight: '35px',
        }
    },
    cells: {
        style: {
            fontSize: "16px",
            paddingTop: '10px',
            paddingBottom: '10px',
            wordBreak: 'break-word',
            border: "none",
            color: "#7684A0",
            fontWeight: '400',
            width: "fit-content",
            '&:first-child': {
                fontWeight: '900',
                color: "#222"
            },
        },

    },
    pagination: {
        style: {
            borderWidth: "0.5px #E5E3E3",
        },
        pageButtonsStyle: {
            borderRadius: '0%',
            padding: "0px",
            margin: "5px",
            height: "25px",
            width: "25px",
            fill: "var(--primary-color)",
            cursor: 'pointer',
            '&:disabled': {
                cursor: 'not-allowed',
            },
            '&:hover:not(:disabled)': {
            },
            '&:focus': {
                outline: 'none',
            },
        }
    }
};

export default customTableStyle;