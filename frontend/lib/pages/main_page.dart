import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:frontend/config.dart';
import 'package:http/http.dart';
import 'package:frontend/pages/choose.dart';
import 'package:frontend/pages/create_user.dart';
import 'package:frontend/pages/create_expense.dart';
import 'package:frontend/pages/tasks.dart';
import 'package:frontend/pages/create_task.dart';

import 'package:frontend/utils/session.dart';
import 'package:frontend/dataStorage/user.dart';

class MainPage extends ConsumerStatefulWidget {
  @override
  _MainPageState createState() => _MainPageState();
}

class _MainPageState extends ConsumerState<MainPage> {
  PageController _pageViewController = PageController();

  int _activePage = 1;

  @override
  void initState() {
    super.initState();

    _pageViewController = PageController(initialPage: _activePage);
  }

  @override
  void dispose() {
    _pageViewController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final user = ref.watch(userProvider);
    return Scaffold(
      appBar: AppBar(
        title: Text("Main Page"),
        centerTitle: true,
        actions: <Widget>[
          PopupMenuButton<int>(
            itemBuilder: (BuildContext context) => <PopupMenuItem<int>>[
              PopupMenuItem(child: Text(user.role.toString() ?? "None")),
              PopupMenuItem<int>(
                child: Text("Logout"),
                onTap: () => {
                  Session.post(Config.logout, {}).then((Response res) {
                    print(res.statusCode);
                    if (res.statusCode == 200) {
                      Session.removeStringsSF(["Cookie"]);
                      Navigator.pushReplacementNamed(context, "/");
                    } else {
                      print("Unexpected error: ${res.statusCode}");
                    }
                  }).catchError((e) => print(e))
                },
              ),
            ],
          )
        ],
      ),
      body: PageView(
        controller: _pageViewController,
        children: <Widget>[
          CreateChild(),
          Tasks(),
          CreateTask(),
          CreateExpense(),
        ],
        onPageChanged: (index) {
          setState(() {
            _activePage = index;
          });
        },
      ),
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _activePage,
        selectedItemColor: Colors.amber[800],
        unselectedItemColor: Colors.black,
        onTap: (index) {
          _pageViewController.animateToPage(index,
              duration: Duration(milliseconds: 200), curve: Curves.bounceOut);
        },
        items: [
          BottomNavigationBarItem(
              icon: Icon(Icons.child_care),
              label: "Create User",
              tooltip: "Create User"),
          BottomNavigationBarItem(
              icon: Icon(Icons.assignment), label: "Tasks", tooltip: "Tasks"),
          BottomNavigationBarItem(
              icon: Icon(Icons.assignment_add),
              label: "Create Task",
              tooltip: "Create Task"),
          BottomNavigationBarItem(
              icon: Icon(Icons.trending_down),
              label: "Add Expense",
              tooltip: "Add Expense"),
        ],
      ),
    );
  }
}
