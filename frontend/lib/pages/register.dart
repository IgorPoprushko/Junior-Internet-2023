import 'package:flutter/material.dart';
import 'package:frontend/config.dart';
import 'package:frontend/utils/errorManager.dart';
import 'package:http/http.dart';
import 'package:frontend/utils/globalWidgets.dart';
import 'package:frontend/utils/session.dart';

class Register extends StatefulWidget {
  @override
  _RegisterState createState() => _RegisterState();
}

class _RegisterState extends State<Register> {
  final GlobalKey<FormState> _formKey = GlobalKey<FormState>();
  @override
  Widget build(BuildContext context) {
    TextEditingController name = TextEditingController();
    TextEditingController last_name = TextEditingController();
    TextEditingController email = TextEditingController();
    TextEditingController login = TextEditingController();
    TextEditingController password = TextEditingController();

    return Scaffold(
      appBar: AppBar(),
      body: Form(
        key: _formKey,
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 30),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              GlobalWidgets.FormInput("Name", name),
              GlobalWidgets.FormInput("Last Name", last_name),
              GlobalWidgets.FormInput("Email", email),
              GlobalWidgets.FormInput("Login", login),
              GlobalWidgets.FormInput("Password", password, obscureText: true),
              Padding(
                padding: EdgeInsets.symmetric(vertical: 10),
                child: ElevatedButton(
                  onPressed: () {
                    if (_formKey.currentState!.validate()) {
                      Session.post(Config.register, {
                        "firstName": name.text,
                        "lastName": last_name.text,
                        "email": email.text,
                        "login": login.text,
                        "password": password.text,
                      }).then((Response res) {
                        if (res.statusCode == 200) {
                          Navigator.pushReplacementNamed(context, "/login");
                        } else {
                          ErrorManager.displayError(context, res);
                        }
                      }).catchError((e) => print(e));
                    }
                  },
                  child: Text("Login"),
                ),
              )
            ],
          ),
        ),
      ),
    );
  }
}
