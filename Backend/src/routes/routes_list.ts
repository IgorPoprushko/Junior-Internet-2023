export const AllRouters = {
	login: [
		"/user/expenses/all/", //:child_id  get all users expenses
		"/user/tasks/assign/all", //:child_id  get all assigned tasks
		"/user/profile/image/", // put profile img
		"/user/profile/update/", // put profile data (name, password etc.)
		"/user/wallet/balance",
		"/user/wallet/log",
	],
	parent: [
		"/family/tasks/all", // get all family tasks
		"/family/tasks/pending", // get all pending tasks
		"/family/tasks/validate", // put confirm/reject to task(s)
		"/family/tasks/add", // create task
		"/family/members/all", // get all users
		"/family/members/add", // create user
	],
	child: [
		"/user/tasks/all", // get all todo tasks
		"/user/expenses/add", // add_expense
		"/user/tasks/assign/add", // create assign task(s)
		"/user/tasks/complete", // put complete to assigned task(s)
	],
	noAccessControle: [
		"/user/login", // login
		"/user/register", // register
		"/user/logout", // logout
	]
}
