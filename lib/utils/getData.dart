import 'dart:convert';
import 'package:http/http.dart';

class Server {
  String url;

  Server({required this.url});

  void getData() async {
    Response response = await get(Uri.parse(this.url));
    Map data = jsonDecode(response.body);
    print(data);
  }
}
