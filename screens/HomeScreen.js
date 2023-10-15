import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert, Dimensions, ScrollView } from "react-native";
import { GiftedChat, InputToolbar, Send } from 'react-native-gifted-chat';
import {
  Icon,
  IconElement,
  Layout,
  MenuItem,
  OverflowMenu,
  TopNavigation,
  TopNavigationAction,
  BottomNavigation,
  BottomNavigationTab,
  Avatar,
  Divider,

} from '@ui-kitten/components';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
const CHAT_GPT_API_KEY = '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'
const user = {
  _id: 1,
  name: 'User',
  avatar: require('../assets/profile.png'),
};

class HomeScreen extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      messages: [],
      userMessages: []
    }
  }

  sendMessage = async (message) => {
    console.log(message)
    try {
      const openaiEndpoint = 'https://api.openai.com/v1/chat/completions'
      const prompt = message;
      const userMessage = { role: 'user', content: message };
      const data = {
        max_tokens: 100,
        n: 1,
        stop: '\n',
        model: 'gpt-3.5-turbo',
        messages: [...this.state.userMessages, userMessage],
      };
      const headers = {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + CHAT_GPT_API_KEY,
      };
      const response = await fetch(openaiEndpoint, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(data),
      });
      const json = await response.json();
      console.log(json.choices[0].message.content)
      return json.choices[0].message.content;

    } catch (err) {
      console.log(err, 'api call error');
    }
  }

  onSend = async (newMessages = []) => {


    const chatMessageUser = [
      {
        _id: Math.random().toString(36).substring(7),
        text: newMessages[0].text,
        createdAt: new Date(),
        user: {
          _id: 1,
          name: 'User',
          avatar: require('../assets/profile.png'),
        },
      },
    ];
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, chatMessageUser),
    }))

    const response = await this.sendMessage(newMessages[0].text);
    const chatMessage = [
      {
        _id: Math.random().toString(36).substring(7),
        text: response,
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'Bible Answer Man',
          avatar: require('../assets/chatgpt.jpg'),
        },
      },
    ];
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, chatMessage),
    }))

  };
  renderSend(props) {
    return (
      <View style={{  flexDirection: "row" }}>
        <Send
          {...props}
        >
             <View style={{marginRight : 8, paddingTop:20}}>
            <Avatar
              size="small"
              source={require('../assets/send.png')}
            />
          </View>
        </Send>
        <TouchableOpacity onPress={() => { Alert.alert("Masih dikembangkan !") }}>
          <View style={{ marginLeft:8, marginRight : 8, paddingTop:12}}>
            <Avatar
              size="small"
              source={require('../assets/voice.png')}
            />
          </View>
        </TouchableOpacity>
      </View>
    );
  }
  render() {
    return (
      <Layout style={{ flex: 1 }}>
        <TopNavigation
          alignment='center'
          title='Bible Answer Man'
          subtitle='Christian AI ChatBot'
          accessoryLeft={(props) => (
            <React.Fragment>
              <View style={{}}></View>
              <Avatar
                size="giant"
                source={require('../assets/chatgpt.jpg')}
              />
            </React.Fragment>

          )}
          accessoryRight={(props) => (
            <React.Fragment>
              <TouchableOpacity>
                <Icon
                  style={styles.icon}
                  fill='#8F9BB3'
                  name='settings-2-outline'
                />
              </TouchableOpacity>
            </React.Fragment>
          )}
        />
        <Divider />
          <GiftedChat
            style={{ flexDirection: "column-reverse"}}
            messages={this.state.messages}
            onSend={messages => this.onSend(messages)}
            renderSend={this.renderSend}
            user={user}
            bottomOffset={-20}
            alwaysShowSend={true}
            placeholder={'Silahkan tanya Bible Answer Man : '}
            showUserAvatar={true}
            showAvatarForEveryMessage={true}
            renderInputToolbar={(props) => (<InputToolbar {...props} containerStyle={styles.input} />)}
            messagesContainerStyle={styles.messageContainer}
          />

      </Layout>
    )
  }

} const styles = StyleSheet.create({
  messageContainer: {
    paddingBottom: 16,
  },
  input: {
    borderColor: 'transparent',
    borderWidth: 0,
    borderRadius: 4,
    marginBottom: 16,
  },
  container: {
    flex: 1,

  },
  icon: {
    width: 32,
    height: 32,
  },
  content: {
    flex: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
}); export default HomeScreen;