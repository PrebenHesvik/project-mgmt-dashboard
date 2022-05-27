import { DataGrid } from '@mui/x-data-grid';
import './datatable.scss';

const Datatable = ({ columns, rows, rowId }) => {
  return (
    <div className='datatable'>
      <DataGrid
        className='datagrid'
        getRowId={rowId}
        rows={rows}
        columns={columns}
        pageSize={20}
        rowsPerPageOptions={[20]}
        pageSizeOptions={[5, 10, 20, 50, 100]}
      />
    </div>
  );
};

export default Datatable;
