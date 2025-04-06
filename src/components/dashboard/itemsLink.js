// 📁 src/constants/sidebarItems.js
import { BookOpenCheck, PlusCircle, Settings } from 'lucide-vue-next'

export const items = [
  {
    name: 'Exams',
    icon: BookOpenCheck,
    children: [
      { name: 'All Exams', route: 'exams' },
      { name: 'Create Exam', route: 'create-exam' }
    ]
  },
  {
    name: 'Courses',
    icon: PlusCircle,
    route: 'courses'
  },
  {
    name: 'Instructors',
    icon: PlusCircle,
    route: 'instructors'
  },
  {
    name: 'Settings',
    icon: Settings,
    route: 'settings'
  }
]
