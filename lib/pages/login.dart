import 'package:flutter/material.dart';
import 'package:http/http.dart';
import 'package:junior_internet_2023/utils/getData.dart';

class Login extends StatefulWidget {
  @override
  _LoginState createState() => _LoginState();
}

class _LoginState extends State<Login> {
  final GlobalKey<FormState> _formKey = GlobalKey<FormState>();

  @override
  initState() {
    Future<Map<String, String?>?> getsel = Session.getStringsSF(["session"]);

    getsel.then((value) => {print(value.toString())});
    super.initState();
  }

  //Server server = Server(url: "http://127.0.0.1:81/api");

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
              FormInput("Family Code:", code),
              FormInput("Login:", login),
              FormInput("Password:", password),
              Padding(
                padding: EdgeInsets.symmetric(vertical: 10),
                child: ElevatedButton(
                  onPressed: () {
                    if (_formKey.currentState!.validate()) {
                      Future<int> status =
                          Session.post("http://127.0.0.1:81/api/login", {
                        "login": login.text,
                        "password": password.text,
                        "family_id": code.text,
                      });

                      status.then((int value) {
                        if (value == 200) {
                          if (value == 200) {
                            Session.addStringsToSF(
                                {"session": Session.headers["cookie"]});
                            Navigator.pushReplacementNamed(context, "/tasks");
                          } else {
                            print("fuck ${value}");
                          }
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

  TextFormField FormInput(String text, var inputController) {
    return TextFormField(
      controller: inputController,
      decoration: InputDecoration(hintText: text),
      validator: (String? value) {
        if (value == null || value.isEmpty) {
          return "Input can't be empty!";
        }
      },
    );
  }
}
