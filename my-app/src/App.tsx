import { Component, ReactNode, createContext } from "react";
import logo from './logo.svg';
import './App.css';
import axios from "axios";
import {
  BrowserRouter,
  Route,
  Link,
  Routes
} from 'react-router-dom';
import { createStore, configureStore } from '@reduxjs/toolkit';
import Provider from 'react-redux';
import {Button, Container, Navbar } from 'react-bootstrap';
import './style/bootstrap.min.css';

interface RequestState { url: string, output: string };

const RequestContext = createContext({ url: "", output: "" });

type Action = { type: string, payload?: any };

const counter = (state = 0, action: Action) => {
  console.log(state);
  switch (action.type) {
    case 'add_click':
      return state + 1
    case 'delete_click':
      return state <= 0 ? 0 : state - 1
    default:
      return state
  }
}

const store = configureStore({ reducer: { count: counter } });

function render() {
  if (document != null) {
    var valueEl = document.getElementById('value');
    if (valueEl != null)
      valueEl.innerHTML = store.getState().count.toString()
  }
}

store.subscribe(render)

export default class App extends Component<{}, RequestState>{

  constructor(props: {}) {
    super(props);
    this.state = { url: "", output: "" }
  }

  setUrl = (inputUrl: string) => {
    this.setState({ url: inputUrl });
    console.log(this.state.url);
  }

  setResponse = (url: string) => {
    axios.get(url).then((response) => {
      this.setState({ output: JSON.stringify(response.data) });
    });
  }

  render(): ReactNode {
    return <>
      <BrowserRouter>
        <Navbar>
          <Container>
            <Navbar.Brand>
              <Link to={'/'}>Home</Link>
            </Navbar.Brand>
            <Navbar.Brand>
              <Link to={'/Register'}>Register</Link>
            </Navbar.Brand>
            <Navbar.Brand>
              <Link to={'/Login'}>Login</Link>
            </Navbar.Brand>
            <Navbar.Brand>
              <Link to={'/Clicker'}>Redux-based clicker</Link>
            </Navbar.Brand>
            <Navbar.Brand>
              <Link to={'/whatareyoulookingfor'}>This page is not exists too</Link>
            </Navbar.Brand>
          </Container>
        </Navbar>
        <Routes>
          <Route index element={
            <RequestContext.Provider value={this.state}>
              <InputUrl handler={this.setUrl} />
              <SendButton handler={this.setResponse} />
              <OutputText />
            </RequestContext.Provider>
          } />
          <Route path="Login" element={<div>Hey! Login!</div>} />
          <Route path="Register" element={<div>Hey! Register!</div>} />
          <Route path="Clicker" element={
            <Clicker/>
          } />
          <Route path="*" element={<div>404</div>} />
        </Routes>
      </BrowserRouter>
    </>;
  }
}

//Компонент-строка ввода (класс)
class Clicker extends Component<{}, RequestState>{

  //Иначе при возврате на ссылку до нажатия на кнопку отображается начальное значение
  componentDidMount(){ 
    render(); 
  } 

  render(): ReactNode {
    return <div>
    Clicked: <span id="value">0</span> times
    <button id="increment" onClick={function () { store.dispatch({ type: 'add_click' }) }}>+</button>
    <button id="decrement" onClick={function () { store.dispatch({ type: 'delete_click' }) }}>-</button>
  </div>
  }
}

//Компонент-строка ввода (класс)
class InputUrl extends Component<{ handler: { (urlToCall: string): void } }, RequestState>{

  render(): ReactNode {
    return <input type="text" onChange={evt => this.props.handler(evt.target.value)} />
  }
}

//Компонент-кнопка (функция)
interface InputUrlProps { handler: { (urlToCall: string): void } }

function SendButton(props: InputUrlProps) {
  return <RequestContext.Consumer>
    {context =>
      <button onClick={() => props.handler(context.url)}>
        Отправить
      </button>
    }
  </RequestContext.Consumer>
}

//Компонент-ответ на запрос (класс)
class OutputText extends Component<{}, RequestState> {
  render(): ReactNode {
    return <RequestContext.Consumer>
      {context => <div className="OutputText">
        {context.output}
      </div>
      }
    </RequestContext.Consumer>
  }
}
