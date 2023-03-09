import 'package:flutter/material.dart';
import 'package:junior_internet_2023/pages/choose.dart';
import 'package:junior_internet_2023/pages/login.dart';
import 'package:junior_internet_2023/pages/register.dart';
import 'package:junior_internet_2023/pages/tasks.dart';

void main() => runApp(MaterialApp(
      initialRoute: "/",
      routes: {
        '/': (context) => Choose(),
        '/login': (context) => Login(),
        '/register': (context) => Register(),
        '/tasks': (context) => Tasks(),
      },
    ));
