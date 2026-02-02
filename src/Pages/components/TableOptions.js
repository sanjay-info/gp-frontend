const TableOptions = () => {
    return {
        headerStyle: {
            backgroundColor: '#274568',
            color: '#FFF',
            height: '60px',
            fontSize: '12px'
        },
        rowStyle: {
            fontSize: '14px'
        },
        search: true,
        sorting: true,
        paging: false,
        actionsColumnIndex: -1,
        draggable: false,
        emptyRowsWhenPaging: false,
    };
};

export default TableOptions;