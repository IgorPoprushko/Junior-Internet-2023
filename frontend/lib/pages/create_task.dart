import 'package:flutter/material.dart';
import 'package:frontend/config.dart';
import 'package:frontend/utils/errorManager.dart';
import 'package:http/http.dart';
import 'package:frontend/dataStorage/user.dart';
import 'package:frontend/utils/globalWidgets.dart';
import 'package:frontend/utils/session.dart';

class CreateTask extends StatefulWidget {
  @override
  _CreateTaskState createState() => _CreateTaskState();
}

class _CreateTaskState extends State<CreateTask> {
  final GlobalKey<FormState> _formKey = GlobalKey<FormState>();

  TextEditingController title = TextEditingController();
  TextEditingController desc = TextEditingController();
  TextEditingController reward = TextEditingController();
  DateTime? start_date = DateTime.now();
  DateTime? end_date = DateTime(
      DateTime.now().year, DateTime.now().month, DateTime.now().day + 1);
  TextEditingController children = TextEditingController();

  DateTime date = DateTime.now();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Form(
        key: _formKey,
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 30),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              GlobalWidgets.FormInput("Title", title),
              GlobalWidgets.FormInput("Desc", desc),
              GlobalWidgets.FormInput("Reward", reward),
              Padding(
                padding: const EdgeInsets.only(top: 20),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceAround,
                  children: [
                    ElevatedButton.icon(
                        style: ElevatedButton.styleFrom(
                            minimumSize: Size(
                                200, 60) // put the width and height you want
                            ),
                        onPressed: () {
                          GlobalWidgets.selectDate(
                            context,
                          ).then((value) {
                            start_date = value;
                            end_date = DateTime(
                                value.year, value.month, value.day + 1);
                          }).catchError((e) => print(e));
                        },
                        icon: Icon(Icons.calendar_month),
                        label: Text("Start date")),
                    ElevatedButton.icon(
                        style: ElevatedButton.styleFrom(
                            minimumSize: Size(200, 60)),
                        onPressed: () {
                          GlobalWidgets.selectDate(
                            context,
                          ).then((value) {
                            end_date = value;
                          }).catchError((e) => print(e));
                        },
                        icon: Icon(Icons.calendar_month),
                        label: Text("End date")),
                  ],
                ),
              ),
              GlobalWidgets.FormInput("Children", children),
              Padding(
                padding: EdgeInsets.symmetric(vertical: 10),
                child: ElevatedButton(
                  onPressed: () {
                    if (_formKey.currentState!.validate() &&
                        start_date != null &&
                        end_date != null) {
                      Session.post(Config.createTask, {
                        "title": title.text,
                        "description": desc.text,
                        "reward": reward.text,
                        "start_date": start_date.toString().split(" ")[0],
                        "end_date": end_date.toString().split(" ")[0],
                        "children_list": children.text,
                      }).then((Response res) {
                        if (res.statusCode == 200) {
                          ScaffoldMessenger.of(context).showSnackBar(
                              SnackBar(content: Text('Created successfully!')));
                        } else {
                          ErrorManager.displayError(context, res);
                        }
                      }).catchError((e) => print(e));
                    }
                  },
                  child: Text("Create"),
                ),
              )
            ],
          ),
        ),
      ),
    );
  }
}
