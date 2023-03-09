import 'package:flutter/material.dart';

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
            onTap: () {},
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
