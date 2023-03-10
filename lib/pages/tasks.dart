import 'package:flutter/material.dart';
import 'package:junior_internet_2023/utils/getData.dart';

class Tasks extends StatefulWidget {
  @override
  _TasksState createState() => _TasksState();
}

class _TasksState extends State<Tasks> {
  final GlobalKey<FormState> _formKey = GlobalKey<FormState>();

  List<Map> data = [
    {"title": "Clean the dishes1"},
    {"title": "Clean the dishes2"},
    {"title": "Clean the dishes3"},
    {"title": "Clean the dishes4"},
    {"title": "Clean the dishes5"},
  ];

  //Server server = Server(url: "http://127.0.0.1:81/api");

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text("MyTasks"),
        centerTitle: true,
      ),
      body: CreateCard(data),
    );
  }

  Widget CreateCard(List<Map<dynamic, dynamic>> e) {
    return ListView.builder(
      itemCount: data.length,
      itemBuilder: (context, index) {
        return Card(
          child: ListTile(
            onTap: () {
              // Future<int> status = server.postData("create_task", {
              //   "task_title": "1",
              //   "task_desc": "2",
              //   "task_reward": "10",
              //   "task_start_date": "1000-01-01",
              //   "task_end_date": "1000-01-01",
              //   "task_children_list": "[]",
              // });

              // status
              //     .then((int value) => {print(value)})
              //     .catchError((e) => {print(e)});

              Future<int> status =
                  Session.post("http://127.0.0.1:81/api/create_task", {
                "task_title": "1",
                "task_desc": "2",
                "task_reward": "10",
                "task_start_date": "1000-01-01",
                "task_end_date": "1000-01-01",
                "task_children_list": "[]",
              });

              status
                  .then((int value) => {print(value)})
                  .catchError((e) => {print(e)});
            },
            title: Text(data[index]["title"]),
            leading: Icon(Icons.access_alarm),
            trailing: Icon(Icons.expand_more),
          ),
        );
      },
    );
  }

  TextFormField FormInput(String text) {
    return TextFormField(
      decoration: InputDecoration(hintText: text),
      validator: (String? value) {
        if (value == null || value.isEmpty) {
          return "Input can't be empty!";
        }
      },
    );
  }
}
