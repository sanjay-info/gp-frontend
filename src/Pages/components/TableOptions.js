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
        paging: true,
        actionsColumnIndex: -1,
        pageSizeOptions: [5, 10, 20],
        pageSize: 5,
        draggable: false,
        emptyRowsWhenPaging: false,
    };
};

export default TableOptions;