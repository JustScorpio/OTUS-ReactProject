import { Component, ReactNode, createContext } from "react";
import logo from './logo.svg';
import './App.css';
import axios from "axios";

interface RequestState { url: string, output: string };

const RequestContext = createContext({ url: "", output: "" });

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
      this.setState({ output: response.data["fact"]});
    });
  }

  render(): ReactNode {
    return <>
      <RequestContext.Provider value={this.state}>
        <InputUrl handler = {this.setUrl}/>
        <Button handler = {this.setResponse}/>
        <OutputText />
      </RequestContext.Provider>
    </>;
  }
}

//Компонент-строка ввода (класс)
class InputUrl extends Component<{handler: {(urlToCall: string): void}}, RequestState>{

  render(): ReactNode {
    return <input type="text" onChange={evt => this.props.handler(evt.target.value)} />
  }
}

//Компонент-кнопка (функция)
interface InputUrlProps {handler: {(urlToCall: string): void}}

function Button(props: InputUrlProps) {
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
