import React, { useState, ReactNode, MouseEvent, ChangeEvent } from 'react';
import { useSearchParams } from 'react-router-dom';
import Base from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import Skeleton from '@mui/material/Skeleton';
import { HeadCell, Order } from '../../interfaces';
import EnhancedTableHead from './EnhancedTableHead';
import EnhancedTableToolbar from './EnhancedTableToolbar';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';

export interface IdObject {
  _id: string;
}

interface TableAction {
  title: string;
  handler: (id: string) => void;
}

interface TableProps<T> {
  data: T[];
  headCells: HeadCell<T>[];
  loading: boolean;
  title: string;
  onDeleteSelected: (selected: string[]) => void;
  total: number;
  onDelete: (id: string) => void;
  loadingDelete: boolean;
  actions?: TableAction[];
  renderCell: (rowIndex: number, object: T, key: keyof T) => ReactNode;
}

function Table<T>({
  data,
  loading,
  headCells,
  onDelete,
  total,
  title,
  onDeleteSelected,
  loadingDelete,
  renderCell,
  actions,
}: TableProps<T>) {
  const [searchParams, setSearchParams] = useSearchParams();

  const searchRowsPerPage = searchParams.get('rows_per_page');
  const searchPage = searchParams.get('page');

  const order = (searchParams.get('order') as Order) ?? Order.asc;
  const orderBy = searchParams.get('order_by') ?? '_id';
  const page = searchPage ? +searchPage : 0;
  const rowsPerPage = searchRowsPerPage ? +searchRowsPerPage : 10;

  const [selected, setSelected] = useState<string[]>([]);

  const handleRequestSort = (event: MouseEvent<unknown>, property: keyof T) => {
    const isAsc = orderBy === property && order === Order.asc;
    searchParams.set('order', isAsc ? Order.desc : Order.asc);
    searchParams.set('order_by', property as string);
    setSearchParams(searchParams);
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = (data as (T & IdObject)[]).map((item) => item._id);
      return setSelected(newSelected);
    }
    setSelected([]);
  };

  const handleSelect = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    searchParams.set('page', newPage.toString());
    setSearchParams(searchParams);
  };

  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
    searchParams.set('page', '0');
    searchParams.set('rows_per_page', event.target.value);
    setSearchParams(searchParams);
  };

  const isSelected = (id: string) => selected.indexOf(id) !== -1;

  const emptyRows = loading ? 0 : rowsPerPage - data.length;

  return (
    <Paper sx={{ width: '100%', mb: 2 }}>
      <EnhancedTableToolbar
        title={title}
        handleDeleteSelected={() => onDeleteSelected(selected)}
        numSelected={selected.length}
      />
      <TableContainer>
        <Base sx={{ minWidth: 750 }} size="medium">
          <EnhancedTableHead
            numSelected={selected.length}
            order={order}
            orderBy={orderBy}
            headCells={headCells}
            onSelectAllClick={handleSelectAllClick}
            onRequestSort={handleRequestSort}
            rowCount={data.length}
          />
          <TableBody>
            {loading
              ? Array.from({ length: rowsPerPage }).map((_, index) => (
                  <TableRow key={index}>
                    {Array.from({ length: headCells.length + 2 }).map(
                      (_, index) => (
                        <TableCell key={index} padding="normal">
                          <Skeleton height={40} animation="wave" />
                        </TableCell>
                      )
                    )}
                  </TableRow>
                ))
              : data.map((r, index) => {
                  const row = r as T & IdObject;
                  const isItemSelected = isSelected(row._id);

                  return (
                    <TableRow
                      hover
                      key={row._id}
                      selected={isItemSelected}
                      sx={{ cursor: 'pointer' }}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          color="primary"
                          onClick={() => handleSelect(row._id)}
                          checked={isItemSelected}
                        />
                      </TableCell>
                      {headCells.map((key) => (
                        <TableCell key={key.id as string} padding="normal">
                          {renderCell(index, row, key.id)}
                        </TableCell>
                      ))}
                      <TableCell padding="normal" align="right">
                        <Stack justifyContent="end" direction="row" spacing={2}>
                          <Tooltip title="Delete">
                            <IconButton
                              color="error"
                              disabled={loadingDelete}
                              onClick={() => onDelete(row._id)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                          {actions?.map((action) => (
                            <Button
                              variant="contained"
                              key={action.title}
                              onClick={() => action.handler(row._id)}
                            >
                              {action.title}
                            </Button>
                          ))}
                        </Stack>
                      </TableCell>
                    </TableRow>
                  );
                })}
            {emptyRows > 0 && (
              <TableRow
                style={{
                  height: 43 * emptyRows,
                }}
              >
                <TableCell colSpan={6} />
              </TableRow>
            )}
          </TableBody>
        </Base>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={total}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}

export default Table;
