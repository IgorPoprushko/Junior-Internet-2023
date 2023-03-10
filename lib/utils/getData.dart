import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';

class Session {
  static Map<String, String> headers = {};

  static Future<Map> get(String url) async {
    http.Response response = await http.get(Uri.parse(url), headers: headers);
    updateCookie(response);
    return json.decode(response.body);
  }

  static Future<int> post(String url, dynamic data) async {
    http.Response response =
        await http.post(Uri.parse(url), body: data, headers: headers);
    updateCookie(response);
    return response.statusCode;
  }

  static void updateCookie(http.Response response) {
    String? rawCookie = response.headers['set-cookie'];
    if (rawCookie != null) {
      int index = rawCookie.indexOf(';');
      headers['cookie'] =
          (index == -1) ? rawCookie : rawCookie.substring(0, index);
    }
  }

  static void addStringsToSF(Map datas) async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    for (int i = 0; i < datas.length; i++) {
      prefs.setString(datas.keys.toList()[i], datas.values.toList()[i]);
    }
  }

  static Future<Map<String, String?>?> getStringsSF(List names) async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    Map<String, String?>? datas = Map<String, String>();
    for (int i = 0; i < names.length; i++) {
      datas[names[i]] = prefs.getString(names[i]);
    }
    return datas;
  }
}
