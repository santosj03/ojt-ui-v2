import { Student } from '@/constants/data';
import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';

export const columns: ColumnDef<Student>[] = [
  {
    id: 'select',
    enableSorting: false,
    enableHiding: false
  },
  {
    // accessorKey: 'firstname',
    accessorFn: (row) => `${row.firstname} ${row.lastname}`,
    header: 'NAME'
  },
  {
    accessorKey: 'class_section',
    header: 'CLASS'
  },
  {
    accessorKey: 'email',
    header: 'EMAIL'
  },
  {
    accessorKey: 'gender',
    header: 'GENDER'
  },
  {
    accessorKey: 'designation',
    header: 'DESIGNATION'
  },
  {
    accessorKey: 'total_hours',
    header: 'RENDERED Hrs'
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];
