// src/router/access-control.js

export default {
    scholarships: {
      blockedIfHas: ["create-scholarship"],
      requires: ["view-scholarships"]
    },
    "dashboard-home": {
      requires: ["view-dashboard"],
    },
    users: {
      requires: ["view-user"],
    },
    instructors: {
      requires: ["view-instructors"],
    },
    courses: {
      requires: ["view-courses"],
    },
    exams: {
      requires: ["view-exams"],
    },
    "create-exam": {
      requires: ["create-exams"],
    },
    "edit-exam": {
      requires: ["edit-exams"],
    },
    roles: {
      requires: ["view-role"],
    },
  };
  