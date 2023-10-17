import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert, Dimensions, ScrollView } from "react-native";
import { GiftedChat, InputToolbar, Send } from 'react-native-gifted-chat';
import {
  Icon,
  Layout,
  TopNavigation,
  Avatar,
  Divider,
  Spinner,
  TopNavigationAction,
  MenuItem,
  OverflowMenu,
  renderMenuAction
} from '@ui-kitten/components';
const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
import Config from "react-native-config";
import Tts from "react-native-tts";
import Voice from 'react-native-voice';
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
      userMessages: [],
      recognized: '',
      pitch: '',
      error: '',
      end: '',
      started: '',
      results: [],
      partialResults: [],
      isTyping: false,
      menuVisible: false,
      sound: true,
    }
  }
  componentDidMount() {
    Tts.setDefaultLanguage('id-ID');
    Tts.setDefaultRate(0.6);
    Voice.onSpeechStart = this.onSpeechStart;
    Voice.onSpeechRecognized = this.onSpeechRecognized;
    Voice.onSpeechEnd = this.onSpeechEnd;
    Voice.onSpeechError = this.onSpeechError;
    Voice.onSpeechResults = this.onSpeechResults;
    Voice.onSpeechPartialResults = this.onSpeechPartialResults;
    Voice.onSpeechVolumeChanged = this.onSpeechVolumeChanged;
    let message = "Halo. Perkenalkan saya adalah Bible Man. Seorang yang memiliki pengetahuan Alkitab dan siap membantu pertanyaan Anda dengan wawasan kristen dari Alkitab. Silahkan bertanya di dalam bahasa Indonesia...  "
    const chatMessage = [
      {
        _id: Math.random().toString(36).substring(7),
        text: message,
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'Bible Man',
          avatar: require('../assets/chatgpt.jpg'),
        },
      },
    ];
     this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, chatMessage),
    }))
    
    if (this.state.sound) {
      Tts.speak(chatMessage[0].text);
      console.log("Speak !")
    }
  }
  onSpeechStart = (e) => {
    console.log('onSpeechStart: ', e);
    this.setState({
      started: '√',
    });
  };

  onSpeechRecognized = (e) => {
    console.log('onSpeechRecognized: ', e);
    this.setState({
      recognized: '√',
    });
  };

  onSpeechEnd = (e) => {
    console.log('onSpeechEnd: ', e);
    this.setState({
      end: '√',
    });
  };

  onSpeechError = (e) => {
    console.log('onSpeechError: ', e);
    this.setState({
      error: JSON.stringify(e.error),
    });
  };

  onSpeechResults = (e) => {
    console.log('onSpeechResults: ', e);
    this.setState({
      results: e.value,
    });
    const chatMessage = [
      {
        _id: Math.random().toString(36).substring(7),
        text: e.value[0],
        createdAt: new Date(),
        user: {
          _id: 1,
          name: 'User',
          avatar: require('../assets/profile.png'),
        },
      },
    ];
    this.onSend(chatMessage)
  };

  onSpeechPartialResults = (e) => {
    console.log('onSpeechPartialResults: ', e);
    this.setState({
      partialResults: e.value,
    });
  };

  onSpeechVolumeChanged = (e) => {
    console.log('onSpeechVolumeChanged: ', e);
    this.setState({
      pitch: e.value,
    });


  };

  _StartRecognizing = async () => {
    this.setState({
      recognized: '',
      pitch: '',
      error: '',
      started: '',
      results: [],
      partialResults: [],
      end: '',
    });
    try {
      Voice.start('id-ID');
    } catch (e) {
      console.error(e);
    }
  }

  _stopRecognizing = async () => {
    try {
      await Voice.stop();
    } catch (e) {
      console.error(e);
    }
  };

  _cancelRecognizing = async () => {
    try {
      await Voice.cancel();
    } catch (e) {
      console.error(e);
    }
  };

  _destroyRecognizer = async () => {
    try {
      await Voice.destroy();
    } catch (e) {
      console.error(e);
    }
    this.setState({
      recognized: '',
      pitch: '',
      error: '',
      started: '',
      results: [],
      partialResults: [],
      end: '',

    });
  };

  sendMessage = async (message) => {
    this.setState({ isTyping: true })
    try {
      const openaiEndpoint = 'https://api.openai.com/v1/chat/completions'
      const userMessage = { role: 'user', content: message };
      const systemMessage = { role: 'system', content: 'Kamu adalah Bible Man. Segala respon dan pengetahuanmu harus didasarkan pada Alkitab. Gunakan bahasa yang ramah dan alkitabiah' };
      const data = {
        max_tokens: 2000,
        temperature: 0.7,
        model: 'gpt-3.5-turbo',
        messages: [systemMessage, ...this.state.userMessages, userMessage],
      };
      const headers = {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + Config.CHAT_GPT_API_KEY,
      };
      const response = await fetch(openaiEndpoint, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(data),
      });
      const json = await response.json();
      this.setState({ isTyping: false })
      return json.choices[0].message.content;

    } catch (err) {
      console.log(err, 'api call error');
    }
  }

  onSend = async (newMessages = []) => {
    Tts.stop();

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
          name: 'Bible Man',
          avatar: require('../assets/chatgpt.jpg'),
        },
      },
    ];
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, chatMessage),
    }))
    let responsefilter = response.replaceAll(/Allah/g, "Al lah").replaceAll(/(\d+):(\d+)-(\d+)/g, "pasal $1 ayat ke $2 sampai ayat ke $3").replaceAll(/(\d+):(\d+)/g, "pasal $1 ayat $2")
    if (this.state.sound) {
      Tts.speak(responsefilter);
      console.log("Speak !")
    }

  };

  render() {
    return (
      <Layout style={{ flex: 1 }}>
        <TopNavigation
          alignment='center'
          title='Bible Man'
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
          accessoryRight={() => (
            <>
              <OverflowMenu
                anchor={() => <TopNavigationAction
                  icon={() => <Icon
                    style={styles.icon}
                    fill='#8F9BB3'
                    name='settings-2-outline'
                  />}
                  onPress={() => { this.setState({ menuVisible: !this.state.menuVisible }) }}
                />}
                visible={this.state.menuVisible}
                onBackdropPress={() => { this.setState({ menuVisible: !this.state.menuVisible }) }}
              >
                <MenuItem
                  accessoryLeft={() => (
                    <MenuItem
                      accessoryLeft={() => <Icon
                        style={styles.icon}
                        fill='#8F9BB3'
                        name='volume-up-outline'
                      />}
                      title='Sound On'
                      onPress={() => {
                        Alert.alert("Sound On", "Suara Bible Man dinyalakan")
                        this.setState({ sound: true })
                      }}
                    />
                  )}
                />
                <MenuItem
                  accessoryLeft={() => (
                    <MenuItem
                      accessoryLeft={() => <Icon
                        style={styles.icon}
                        fill='#8F9BB3'
                        name='volume-off-outline'
                      />}
                      title='Sound Off'
                      onPress={() => {
                        Alert.alert("Sound Off", "Suara Bible Man dimatikan")
                        this.setState({ sound: false })
                      }}
                    />
                  )}
                />
              </OverflowMenu>
            </>
          )}
        />
        <Divider />
        <GiftedChat
          style={{}}
          messages={this.state.messages}
          onSend={messages => { this.onSend(messages) }}
          renderSend={(props) => (<View style={{ flexDirection: "row" }}>
            <Send
              {...props}
            >
              <View style={{ marginRight: 8, paddingTop: 20 }}>
                <Avatar
                  size="small"
                  source={require('../assets/send.png')}
                />
              </View>
            </Send>
            <TouchableOpacity onPress={async () => {
              Tts.stop();
              await this._StartRecognizing()
            }}>
              <View style={{ marginLeft: 8, marginRight: 8, paddingTop: 12 }}>
                <Avatar
                  size="small"
                  source={require('../assets/voice.png')}
                />
              </View>
            </TouchableOpacity>
          </View>)}
          user={user}
          bottomOffset={-10}
          renderLoading={() => {
            return (
              <Spinner size="tiny" />
            );
          }}
          renderFooter={() => {
            if (this.state.isTyping) {
              return (<View style={{ justifyContent: "center", alignItems: "center" }}>
                <Spinner size="tiny" /></View>
              );
            }
          }}
          wrapInSafeArea={false}
          alwaysShowSend={true}
          placeholder={'Silahkan tanya Bible Man : '}
          showUserAvatar={true}
          renderUsernameOnMessage={true}
          showAvatarForEveryMessage={true}
          renderInputToolbar={(props) => (<InputToolbar placeholderTextColor="#000" {...props} containerStyle={styles.input} />)}
          messagesContainerStyle={styles.messageContainer}
          shouldUpdateMessage={() => {
            return true;
          }}
        />

      </Layout>
    )
  }

} const styles = StyleSheet.create({
  messageContainer: {
    paddingBottom: 16,
  },
  input: {
    borderWidth: 0,
    borderRadius: 4,
    marginBottom: 8,
    color: "black"
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