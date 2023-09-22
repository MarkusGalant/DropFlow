/* eslint-disable @typescript-eslint/no-explicit-any */
import { ReactNode } from 'react';
import get from 'lodash/get';

//@mui
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow, { TableRowProps } from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

export type Column = {
  field: string;
  header?: ReactNode;
  align?: 'center' | 'inherit' | 'left' | 'right' | 'justify';
  content?: ReactNode;
  renderCell: (value: any, row: any, column: any) => JSX.Element;
};

type GridProps = {
  keyField: string;
  columns: Column[];
  rows: any[];
  tableRowProps?: (row: any) => TableRowProps;
};

export default function GridTable({
  keyField,
  columns,
  rows,
  tableRowProps,
}: GridProps) {
  return (
    <TableContainer component={Paper}>
      <Table aria-label="collapsible table">
        <TableHead>
          <TableRow>
            {columns.map((col, i) => (
              <TableCell key={`header-${i}`} align={col.align}>
                {col.header}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow
              key={row[keyField]}
              {...(tableRowProps && tableRowProps(row))}
            >
              {columns.map((col, i) => (
                <TableCell key={`${row[keyField]}-${i}`} align={col.align}>
                  {col.renderCell(get(row, col.field), row, col)}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
