import {useState} from "react";
import { SafeAreaView, StyleSheet, TextInput, TouchableOpacity, Text } from "react-native";

const sendText= async (phoneNumber)=>{
  console.log("PhoneNumber: ",phoneNumber);
  await fetch('https://dev.stedi.me/twofactorlogin/'+phoneNumber,{
    method: 'POST',
    headers:{
    'content-type':'application/text'
  }
  });
}

const getToken = async ({phoneNumber, oneTimePassword, setUserLoggedIn, setUserName}) =>{
  const tokenResponse = await fetch ('https://dev.stedi.me/twofactorlogin',{
    method: 'POST',
    body:JSON.stringify({oneTimePassword, phoneNumber}),
    headers: {
      'content-type':'application/json'
    }
  });

  const responseCode = tokenResponse.status;//200 means logged in successfully
  console.log("Response Status Code", responseCode);
  if(responseCode==200){
    setUserLoggedIn(true);
  }
const tokenResponseString = await tokenResponse.text();
console.log("Token",tokenResponseString);

const emailResponse = await fetch('https://dev.stedi.me/validate/'+tokenResponseString);

const email = await emailResponse.text();

console.log("Email",email);
setUserName(email);
}
const Login = (props) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [oneTimePassword, setOneTimePassword] = useState(null);

  return (
    <SafeAreaView style={styles.margin}>
      <TextInput
        style={styles.input}
        onChangeText={setPhoneNumber}
        value={phoneNumber}
        placeholderTextColor='#b734eb'
        placeholder="801-555-1212"
      />
      <TouchableOpacity
        style={styles.button}
        onPress={()=>{ 
          console.log("buttonPress")
          sendText(phoneNumber);
        }}
      >
        <Text>Send Text</Text>
      </TouchableOpacity>
      <TextInput
        style={styles.input}
        onChangeText={setOneTimePassword}
        value={oneTimePassword}
        placeholder="1234"
        placeholderTextColor='#b734eb'
        keyboardType="numeric"
        secureTextEntry={true}
      />
      <TouchableOpacity
        style={styles.button}
        onPress={()=>{
          getToken({phoneNumber,oneTimePassword,setUserLoggedIn:props.setUserLoggedIn,setUserName:props.setUserName});
        }}
      >
        <Text>Press Here</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  margin:{
    margintop:200
  },
  button: {
    alignItems: "center",
    backgroundColor: "#DDDDDD",
    padding: 10
  }
});

export default Login;