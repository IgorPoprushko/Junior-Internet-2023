import 'package:flutter/material.dart';
import 'package:frontend/config.dart';
import 'package:frontend/utils/errorManager.dart';
import 'package:http/http.dart';
import 'package:frontend/utils/globalWidgets.dart';
import 'package:frontend/utils/session.dart';

class CreateChild extends StatefulWidget {
  @override
  _CreateChildState createState() => _CreateChildState();
}

class _CreateChildState extends State<CreateChild> {
  final GlobalKey<FormState> _formKey = GlobalKey<FormState>();

  TextEditingController name = TextEditingController();
  TextEditingController last_name = TextEditingController();
  TextEditingController login = TextEditingController();
  TextEditingController password = TextEditingController();
  String? role = "0";

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
              GlobalWidgets.FormInput("First Name", name),
              GlobalWidgets.FormInput("Last Name", last_name),
              GlobalWidgets.FormInput("Login", login),
              GlobalWidgets.FormInput("Password", password, obscureText: true),
              SizedBox(height: 10),
              DropdownButton(
                value: role,
                isExpanded: true,
                icon: Icon(Icons.keyboard_arrow_down, size: 22),
                underline: SizedBox(),
                items: [
                  DropdownMenuItem(
                    child: Text("Kid"),
                    value: "0",
                  ),
                  DropdownMenuItem(
                    child: Text("Parent"),
                    value: "1",
                  ),
                ],
                onChanged: (value) {
                  setState(() {
                    role = value;
                  });
                },
              ),
              Padding(
                padding: EdgeInsets.symmetric(vertical: 10),
                child: ElevatedButton(
                  onPressed: () {
                    if (_formKey.currentState!.validate()) {
                      Session.post(Config.createUser, {
                        "firstName": name.text,
                        "lastName": last_name.text,
                        "login": login.text,
                        "password": password.text,
                        "role": role,
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
