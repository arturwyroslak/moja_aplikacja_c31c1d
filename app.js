import React, { useState, useEffect } from 'react';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import CodeMirror from 'react-codemirror';
import 'codemirror/addon/scroll/simplescrollbars.css';
import 'codemirror/lib/codemirror.css';
import './app.css';

// Initialize Firebase
const firebaseConfig = {
  apiKey: 'YOUR_API_KEY',
  authDomain: 'YOUR_AUTH_DOMAIN',
  databaseURL: 'YOUR_DATABASE_URL',
  projectId: 'YOUR_PROJECT_ID',
  storageBucket: 'YOUR_STORAGE_BUCKET',
  messagingSenderId: 'YOUR_MESSAGING_SENDER_ID',
  appId: 'YOUR_APP_ID',
};

firebase.initializeApp(firebaseConfig);

const App = () => {
  const [user, setUser] = useState(null);
  const [code, setCode] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider);
  };

  const signOut = () => {
    firebase.auth().signOut();
  };

  const generateCode = () => {
    // Call OpenAI GPT-3.5-turbo API to generate code based on user's input
    // Set the generated code in the state
    setGeneratedCode('Generated code goes here');
  };

  const saveCode = () => {
    // Save the code to Firestore database
    const firestore = firebase.firestore();
    firestore
      .collection('projects')
      .doc(user.uid)
      .set({
        code: generatedCode,
      })
      .then(() => {
        console.log('Code saved successfully');
      })
      .catch((error) => {
        console.log('Error saving code:', error);
      });
  };

  return (
    <div className="app">
      <header className="header">
        <h1>Advanced Code Editor</h1>
        {user ? (
          <button className="signout-btn" onClick={signOut}>
            Sign Out
          </button>
        ) : (
          <button className="signin-btn" onClick={signInWithGoogle}>
            Sign In with Google
          </button>
        )}
      </header>
      {user && (
        <div className="main">
          <div className="sidebar">
            <CodeMirror
              className="code-editor"
              value={code}
              onChange={setCode}
              options={{
                lineNumbers: true,
                theme: 'material',
              }}
            />
            <button className="generate-btn" onClick={generateCode}>
              Generate Code
            </button>
          </div>
          <div className="preview">
            <CodeMirror
              className="code-preview"
              value={generatedCode}
              options={{
                readOnly: true,
                lineNumbers: true,
                theme: 'material',
              }}
            />
            <button className="save-btn" onClick={saveCode}>
              Save Code
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;