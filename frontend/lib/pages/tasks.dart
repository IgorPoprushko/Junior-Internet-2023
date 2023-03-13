import 'package:flutter/material.dart';
import 'package:http/http.dart';
import 'package:frontend/utils/session.dart';

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

  int _value = 1;
  @override
  Widget build(BuildContext context) {
    return Scaffold(body: CreateCard(data));
  }

  Widget CreateCard(List<Map<dynamic, dynamic>> e) {
    return ListView.builder(
      itemCount: data.length,
      itemBuilder: (context, index) {
        return Card(
          child: ListTile(
            onTap: () => {print("ok")},
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
