import 'package:flutter/material.dart';

class Login extends StatefulWidget {
  @override
  _LoginState createState() => _LoginState();
}

class _LoginState extends State<Login> {
  final GlobalKey<FormState> _formKey = GlobalKey<FormState>();
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
              FormInput("Family Code:"),
              FormInput("Login:"),
              FormInput("Password:"),
              Padding(
                padding: EdgeInsets.symmetric(vertical: 10),
                child: ElevatedButton(
                  onPressed: () {
                    if (_formKey.currentState!.validate()) {
                      print("Login!"); // backend
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
