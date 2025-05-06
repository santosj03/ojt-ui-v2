import DataTable from '@/components/shared/data-table';
import { columns } from './columns';
import TaskTableActions from './task-table-action';

type TStudentsTableProps = {
  users: any;
  page: number;
  totalUsers: number;
  pageCount: number;
};

export default function StudentsTable({
  users,
  pageCount
}: TStudentsTableProps) {
  return (
    <>
      <TaskTableActions />
      {users && (
        <DataTable columns={columns} data={users} pageCount={pageCount} />
      )}
    </>
  );
}
