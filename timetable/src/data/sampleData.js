const sampleData = {
  semester: 3,

  subjects: [
    {
      name: "Data Structures",
      teacher: "Dr. Sharma",
      weekly: 4,
      type: "theory"
    },
    {
      name: "Object Oriented Programming",
      teacher: "Prof. Verma",
      weekly: 3,
      type: "theory"
    },
    {
      name: "Computer Networks",
      teacher: "Dr. Singh",
      weekly: 3,
      type: "theory"
    },
    {
      name: "Machine Learning",
      teacher: "Dr. Patel",
      weekly: 2,
      type: "theory"
    }
  ],

  practicals: [
    {
      name: "DS Lab",
      teacher: "Dr. Sharma",
      weekly: 1,
      duration: 2
    },
    {
      name: "OOP Lab",
      teacher: "Prof. Verma",
      weekly: 1,
      duration: 2
    }
  ],

  extras: [
    {
      name: "Library",
      teacher: null,
      weekly: 1
    },
    {
      name: "Mentor Meeting",
      teacher: "Dr. Singh",
      weekly: 1
    }
  ]
};

export default sampleData;