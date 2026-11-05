import { getStudentList } from '@/lib/analytics/data'
import { StudentManagementClient } from './student-management-client'

export default async function AdminStudentsPage() {
  const students = await getStudentList()

  return <StudentManagementClient initialStudents={students} />
}
