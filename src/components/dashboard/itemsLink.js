// 📁 src/constants/sidebarItems.js

export const items = [
    {
      name: 'Exams',
      children: [
        { name: 'All Exams', route: 'exams' },
        { name: 'Create Exam', route: 'create-exam' },
        { name: 'Delete Exam', route: '/exams/delete' },
      ],
    },
    {
      name: 'Settings',
      route: '/settings',
    },
  ]
  