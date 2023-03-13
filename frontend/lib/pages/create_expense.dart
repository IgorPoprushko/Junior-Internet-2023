import 'package:flutter/material.dart';
import 'package:frontend/config.dart';
import 'package:frontend/utils/errorManager.dart';
import 'package:http/http.dart';
import 'package:frontend/utils/globalWidgets.dart';
import 'package:frontend/utils/session.dart';

class CreateExpense extends StatefulWidget {
  @override
  _CreateExpenseState createState() => _CreateExpenseState();
}

class _CreateExpenseState extends State<CreateExpense> {
  final GlobalKey<FormState> _formKey = GlobalKey<FormState>();

  TextEditingController category = TextEditingController();
  TextEditingController amount = TextEditingController();

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
              GlobalWidgets.FormInput("Category", category),
              GlobalWidgets.FormInput("Amount", amount),
              Padding(
                padding: EdgeInsets.symmetric(vertical: 10),
                child: ElevatedButton(
                  onPressed: () {
                    if (_formKey.currentState!.validate()) {
                      Session.post(Config.addExpense, {
                        "category": category.text,
                        "amount": amount.text,
                      }).then((Response res) {
                        if (res.statusCode == 200) {
                          ScaffoldMessenger.of(context).showSnackBar(
                              SnackBar(content: Text('Created successfully!')));
                        } else {
                          ErrorManager.displayError(context, res);
                        }
                      }).catchError((e) => print(e));
                    }
                  },
                  child: Text("Add"),
                ),
              )
            ],
          ),
        ),
      ),
    );
  }
}
