import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:frontend/config.dart';
import 'package:frontend/utils/errorManager.dart';
import 'package:http/http.dart';
import 'package:frontend/utils/globalWidgets.dart';
import 'package:frontend/utils/session.dart';
import 'package:frontend/pages/choose.dart';
import 'package:frontend/dataStorage/user.dart';

class Login extends ConsumerStatefulWidget {
  @override
  _LoginState createState() => _LoginState();
}

class _LoginState extends ConsumerState<Login> {
  final GlobalKey<FormState> _formKey = GlobalKey<FormState>();

  @override
  initState() {
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    TextEditingController code = TextEditingController();
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
              GlobalWidgets.FormInput("Family Code", code),
              GlobalWidgets.FormInput("Login", login),
              GlobalWidgets.FormInput("Password", password, obscureText: true),
              Padding(
                padding: EdgeInsets.symmetric(vertical: 10),
                child: ElevatedButton(
                  onPressed: () {
                    if (_formKey.currentState!.validate()) {
                      Session.post(Config.login, {
                        "family_id": code.text,
                        "login": login.text,
                        "password": password.text,
                      }).then((Response res) {
                        if (res.statusCode == 200) {
                          ref.read(userProvider.notifier).state =
                              User(role: jsonDecode(res.body)["role"]);
                          Navigator.pushNamedAndRemoveUntil(context,
                              '/main_page', (Route<dynamic> route) => false);
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
