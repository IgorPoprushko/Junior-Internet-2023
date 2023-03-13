import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:frontend/pages/choose.dart';
import 'package:frontend/pages/login.dart';
import 'package:frontend/pages/register.dart';

import 'package:frontend/pages/main_page.dart';

void main() => runApp(ProviderScope(
      child: MaterialApp(
        initialRoute: "/",
        routes: {
          '/': (context) => Choose(),
          '/login': (context) => Login(),
          '/register': (context) => Register(),
          '/main_page': (context) => MainPage(),
        },
      ),
    ));
