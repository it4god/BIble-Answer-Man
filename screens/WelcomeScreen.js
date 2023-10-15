import React from "react";
import { View, StyleSheet, TouchableOpacity, Alert, Dimensions, ScrollView, Image } from "react-native";
import {
  Divider,
  Layout, Text
} from '@ui-kitten/components';


class WelcomeScreen extends React.Component {

  constructor(props) {
    super(props)
    this.state = {

    }
  }
  componentDidMount() {
    this.focus = this.props.navigation.addListener('focus', () => {
      setTimeout(() => { this.props.navigation.navigate("Home") }, 2000)
    });
    setTimeout(() => { this.props.navigation.navigate("Home") }, 2000)
  }

  render() {
    return (
      <Layout style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <View style={{ padding: 20, justifyContent: "center", alignItems: "center" }}>
          <Image
            style={{ width: 150, height: 150 }}
            source={require('../assets/ylsa.png')}
          />
          <View style={{ height: 150 }}></View>
          <Divider />
          <Image
            style={{ width: 150, height: 150 }}
            source={require('../assets/chatgpt.jpg')}
          />
          <Image
            style={{ width: 150, height: 150 }}
            source={require('../assets/robot.png')}
          />
          <Text category="h1">Bible Answer Man</Text>
        </View>
      </Layout>
    )
  }

} const styles = StyleSheet.create({

}); export default WelcomeScreen;