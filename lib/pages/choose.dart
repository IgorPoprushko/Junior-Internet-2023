import 'package:flutter/material.dart';
import 'package:junior_internet_2023/utils/getData.dart';

class Choose extends StatefulWidget {
  @override
  _ChooseState createState() => _ChooseState();
}

class _ChooseState extends State<Choose> {
  @override
  void initState() {
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: Center(
          child: Wrap(
            crossAxisAlignment: WrapCrossAlignment.center,
            spacing: 10,
            direction: Axis.vertical,
            children: [
              ElevatedButton.icon(
                onPressed: () {
                  Navigator.pushNamed(context, "/login");
                },
                icon: Icon(Icons.login),
                label: Text("Login"),
              ),
              ElevatedButton.icon(
                onPressed: () {
                  Navigator.pushNamed(context, "/register");
                },
                icon: Icon(Icons.app_registration),
                label: Text("Register"),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
