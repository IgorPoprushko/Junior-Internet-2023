class User {
  int? role;

  User({this.role});

  copyWith({int? role}) {
    return User(role: role ?? this.role);
  }
}
