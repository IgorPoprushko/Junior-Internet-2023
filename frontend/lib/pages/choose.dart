import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:frontend/config.dart';
import 'package:http/http.dart';
import 'package:frontend/dataStorage/user.dart';
import 'package:frontend/utils/session.dart';

class Choose extends ConsumerStatefulWidget {
  const Choose({Key? key}) : super(key: key);
  @override
  _ChooseState createState() => _ChooseState();
}

final userProvider = StateProvider<User>((ref) => User());

class _ChooseState extends ConsumerState<Choose> {
  // final user = ref.read(userProvider);
  @override
  void initState() {
    super.initState();
    Session.checkSession().then((value) {
      print(Session.headers);
      if (Session.headers.isNotEmpty) {
        Session.post(Config.login, {}).then((Response res) {
          if (res.statusCode == 200) {
            ref.read(userProvider.notifier).state =
                User(role: json.decode(res.body)["role"]);
            Navigator.pushReplacementNamed(context, "/main_page");
          }
        });
      }
    });
  }

  @override
  Widget build(
    BuildContext context,
  ) {
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
