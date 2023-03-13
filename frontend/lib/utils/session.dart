import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';

class Session {
  static Map<String, String> headers = {};
  static String server = "http://127.0.0.1/api/";

  static void addStringsToSF(Map datas) async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    for (int i = 0; i < datas.length; i++) {
      prefs.setString(datas.keys.toList()[i], datas.values.toList()[i]);
    }
  }

  static Future<Map<String, String>> getStringsSF(List<String> names) async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    Map<String, String> datas = Map<String, String>();
    for (int i = 0; i < names.length; i++) {
      print(names[i]);
      datas[names[i]] = prefs.getString(names[i]) ?? "";
    }
    return datas;
  }

  static void removeStringsSF(List<String> names) async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    for (int i = 0; i < names.length; i++) {
      prefs.remove(names[i]);
    }
  }

  static Future<Map> get(String url) async {
    http.Response response =
        await http.get(Uri.parse(server + url), headers: headers);
    updateCookie(response);
    return json.decode(response.body);
  }

  static Future<http.Response> post(String url, dynamic data) async {
    http.Response response = await http
        .post(Uri.parse(server + url), body: jsonEncode(data), headers: {
      ...headers,
      ...{"Content-Type": "application/json"}
    });
    updateCookie(response);
    return response;
  }

  static void updateCookie(http.Response response) {
    String? rawCookie = response.headers['set-cookie'];
    if (rawCookie != null) {
      int index = rawCookie.indexOf(';');
      headers['Cookie'] =
          (index == -1) ? rawCookie : rawCookie.substring(0, index);
      addStringsToSF(headers);
    }
  }

  static Future<void> checkSession() async {
    await getStringsSF(["Cookie"]).then((value) {
      if (value != null && value.length > 0) {
        headers.addAll(value);
      }
    });
  }
}
