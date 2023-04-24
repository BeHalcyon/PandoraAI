import CredentialsProvider from 'next-auth/providers/credentials'
import GithubProvider from 'next-auth/providers/github'
import { NuxtAuthHandler } from "#auth";
import * as CryptoJS from "crypto-js";

//秘钥
const CRYPTOJSKEY = "l_0ak(*kl230(*[s";
const iv = "0102030405060708";

export class AesManager {

    //加密
    /*
    * {param} plaintText 加密明文
    * return  str 加密结果
    */
    public static encrypt(plaintText: string): string {
        var plaintText = plaintText;
        var options = {
            iv: CryptoJS.enc.Utf8.parse(iv),
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        };
        var key = CryptoJS.enc.Utf8.parse(CRYPTOJSKEY);
        var encryptedData = CryptoJS.AES.encrypt(plaintText, key, options);
        var encryptedBase64Str = encryptedData.toString();
        return encryptedBase64Str;
    }
    //解密
    /*
    * {param} plaintText 解密密文
    
    * return  str 解密结果
*/
    public static decrypt(encryptedBase64Str: string): string {
        var encryptedBase64Str = encryptedBase64Str;
        var options = {
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        };
        var key = CryptoJS.enc.Utf8.parse(CRYPTOJSKEY);
        // 解密
        var decryptedData = CryptoJS.AES.decrypt(encryptedBase64Str, key, options);
        // 解密后，需要按照Utf8的方式将明文转位字符串
        var decryptedStr = decryptedData.toString(CryptoJS.enc.Utf8);
        return decryptedStr;
    }

  }
export default NuxtAuthHandler({
    // secret needed to run nuxt-auth in production mode (used to encrypt data)
    secret: process.env.NUXT_SECRET,
    providers: [
        // @ts-ignore Import is exported on .default during SSR, so we need to call it this way. May be fixed via Vite at some point
        // GithubProvider.default({
        //     clientId: process.env.GITHUB_CLIENT_ID,
        //     clientSecret: process.env.GITHUB_CLIENT_SECRET
        // }),
        // @ts-ignore Import is exported on .default during SSR, so we need to call it this way. May be fixed via Vite at some point
        CredentialsProvider.default({
            // The name to display on the sign in form (e.g. 'Sign in with...')
            name: 'Password',
            // The credentials is used to generate a suitable form on the sign in page.
            // You can specify whatever fields you are expecting to be submitted.
            // e.g. domain, username, password, 2FA token, etc.
            // You can pass any HTML attribute to the <input> tag through the object.
            credentials: {
              username: { label: '账号', type: 'text', placeholder: '(提示: 任意名称)' },
              password: { label: '卡密', type: 'password', placeholder: '(提示: fisher)' }
            },
            authorize (credentials: any) {
              // You need to provide your own logic here that takes the credentials
              // submitted and returns either a object representing a user or value
              // that is false/null if the credentials are invalid.
              // NOTE: THE BELOW LOGIC IS NOT SAFE OR PROPER FOR AUTHENTICATION!

              const user = { id: '1', name: 'fisher', username: 'fisher', password: 'fisher', image: 'https://avatars.githubusercontent.com/u/25911230?v=4' }
              
              // console.log(decrypt(credentials?.password))

              try {
                
                console.log(AesManager.decrypt(credentials?.password));
              }
              catch (error) {
                console.log(error)
              }

              // if (credentials?.username === user.username && credentials?.password === user.password) {
              if (credentials?.password === user.password) {
              // if (credentials?.password === "") {
                // Any object returned will be saved in `user` property of the JWT
                user.username = credentials?.username;
                user.name = credentials?.username;
                return user
              } else {
                // eslint-disable-next-line no-console
                console.error('Warning: Malicious login attempt registered, bad credentials provided')

                // If you return null then an error will be displayed advising the user to check their details.
                return null

                // You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter
              }
            }
        })
    ]
})