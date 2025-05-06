import { Task } from '@/constants/data';
import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';

export const columns: ColumnDef<Task>[] = [
  {
    id: 'select',
    enableSorting: false,
    enableHiding: false
  },
  {
    // accessorKey: 'firstname',
    accessorFn: (row) => `${row.student.firstname} ${row.student.lastname}`,
    header: 'STUDENT NAME'
  },
  {
    accessorKey: 'description',
    header: 'DESCRIPTION'
  },
  {
    accessorKey: 'difficulty',
    header: 'DIFFICULTY'
  },
  {
    accessorKey: 'start_date',
    header: 'START DATE'
  },
  {
    accessorKey: 'end_date',
    header: 'END DATE'
  },
  {
    accessorKey: 'status',
    header: 'STATUS'
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];
