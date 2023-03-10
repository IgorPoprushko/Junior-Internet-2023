module.exports = {
  db_connect: {
    connectionLimit: 80,
    host: "127.0.0.1",
    user: "root",
    password: "toor",
    database: "junior_internet_2023",
  },
  email_sender: {
    user: 'juniorinternet2023emailsender@gmail.com',
    pass: 'mujoxmakyaltpzku'
  },
  server: {
    port: 80,
  },
  data:{
    ParentRole: "parent",
    ChildRole: "kid",
    Roles:{
      0: "kid",
      1: "parent"
    }
  },
  routes:{
    login: "/api/login",
    logout: "/api/logout",
    register: "/api/register",
    create_task: "/api/create_task",
    create_user: "/api/create_user",
    add_expense: "/api/add_expense",

  },
};
