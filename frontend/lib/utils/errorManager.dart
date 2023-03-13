import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:frontend/utils/session.dart';
import 'package:http/http.dart';

class ErrorManager {
  static ScaffoldFeatureController<SnackBar, SnackBarClosedReason> displayError(
    BuildContext context,
    Response res,
  ) {
    if (res.statusCode == 403) {
      Session.removeStringsSF(["Cookie"]);
      Navigator.pushReplacementNamed(context, "/");
    }
    return ScaffoldMessenger.of(context)
        .showSnackBar(SnackBar(content: Text(jsonDecode(res.body)["message"])));
  }
}
