import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  FlatList, 
  StyleSheet, 
  KeyboardAvoidingView, 
  Platform,
  Modal
} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { WebView } from 'react-native-webview';

const ChatMessage = ({ item }) => (
  <View style={[styles.messageBubble, item.isUser ? styles.userMessage : styles.botMessage]}>
    <Text style={item.isUser ? styles.userMessageText : styles.botMessageText}>{item.text}</Text>
  </View>
);

const ChatBot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [pdfUri, setPdfUri] = useState(null);
  const [showPdf, setShowPdf] = useState(false);

  const sendMessage = () => {
    if (input.trim() === '' && !pdfUri) return;

    let userMessage;
    if (pdfUri) {
      userMessage = { id: Date.now().toString(), text: "PDF Sent", isUser: true, isPdf: true };
      // Here you would typically send the PDF to your backend or process it
      console.log("Sending PDF:", pdfUri);
      setPdfUri(null); // Clear the PDF after sending
    } else {
      userMessage = { id: Date.now().toString(), text: input, isUser: true };
    }

    setMessages(prevMessages => [...prevMessages, userMessage]);
    setInput('');

    // Simulate bot response
    setTimeout(() => {
      const botMessage = { id: (Date.now() + 1).toString(), text: "This is a simulated response.", isUser: false };
      setMessages(prevMessages => [...prevMessages, botMessage]);
    }, 1000);
  };

  const pickPdf = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/pdf',
      });
      
      if (result.type === 'success') {
        setPdfUri(result.uri);
        setInput("PDF selected: " + result.name); // Show selected PDF name in input
      }
    } catch (err) {
      console.error('Error picking PDF:', err);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.header}>
        <Text style={styles.headerText}>ChatBot</Text>
      </View>
      <FlatList
        data={messages}
        renderItem={({ item }) => <ChatMessage item={item} />}
        keyExtractor={item => item.id}
        style={styles.chatContainer}
        contentContainerStyle={styles.chatContentContainer}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="Type your message..."
          placeholderTextColor="#999"
        />
        <TouchableOpacity style={styles.pdfButton} onPress={pickPdf}>
          <Text style={styles.pdfButtonText}>PDF</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
      <Modal visible={showPdf} animationType="slide">
        <View style={styles.pdfContainer}>
          <TouchableOpacity style={styles.closePdfButton} onPress={() => setShowPdf(false)}>
            <Text style={styles.closePdfButtonText}>Close PDF</Text>
          </TouchableOpacity>
          {pdfUri && (
            <WebView
              source={{ uri: pdfUri }}
              style={styles.pdf}
            />
          )}
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#4a90e2',
    padding: 15,
  },
  headerText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  chatContainer: {
    flex: 1,
  },
  chatContentContainer: {
    padding: 10,
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 10,
    borderRadius: 20,
    marginBottom: 10,
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#007aff',
  },
  botMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#e5e5ea',
  },
  userMessageText: {
    color: 'white',
  },
  botMessageText: {
    color: 'black',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: 'white',
  },
  input: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginRight: 10,
  },
  pdfButton: {
    backgroundColor: '#3a70b2',
    borderRadius: 20,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  pdfButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  sendButton: {
    backgroundColor: '#007aff',
    borderRadius: 20,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  pdfContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  pdf: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  closePdfButton: {
    backgroundColor: '#007aff',
    padding: 10,
    alignItems: 'center',
  },
  closePdfButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default ChatBot;