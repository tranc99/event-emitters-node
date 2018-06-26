$(document).ready(function() {
  return $("#auth-btn").click(function() {
    var signin;
    signin = $("#form-template").html();
    return $("#learn-lib").append(signin);
  });
});
