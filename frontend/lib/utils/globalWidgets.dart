import 'package:flutter/material.dart';

class GlobalWidgets {
  static TextFormField FormInput(String text, var inputController,
      {bool obscureText = false}) {
    return TextFormField(
      controller: inputController,
      obscureText: obscureText,
      decoration: InputDecoration(hintText: "${text}:"),
      validator: (String? value) {
        if (value == null || value.isEmpty) {
          return "Input can't be empty!";
        }
      },
    );
  }

  static Future<DateTime> selectDate(BuildContext context) async {
    DateTime selectedDate = DateTime.now();

    final DateTime? picked = await showDatePicker(
        context: context,
        initialDate: selectedDate,
        firstDate: DateTime(selectedDate.year, selectedDate.month),
        lastDate: DateTime(selectedDate.year + 100));
    return picked ?? DateTime.now();
  }
}
