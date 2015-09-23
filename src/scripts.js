import { profile } from '../config';

export default {
  login () {
    return `function() {
    document.querySelector('#login_username').setValue('${profile.login}');
    document.querySelector('#login_password').setValue('${profile.password}');
    document.querySelector('#sign_in_button').click();}`;
  }
}
