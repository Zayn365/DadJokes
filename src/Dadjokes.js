import React, { Component } from "react";
import axios from "axios";
import "./JokeList.css";
import Joke from "./Joke";
import { v4 as uuidv4 } from "uuid";

class Dadjokes extends Component {
  static defaultProps = {
    numofjokes: 10,
  };
  state = {
    jokes: JSON.parse(window.localStorage.getItem("jokes") || []),
    loading: false
  };

  componentDidMount() {
    if (this.state.jokes.length === 0){ 
    this.getJokes();
    
  }
}
 handleClick= () => {
  this.setState({loading: true} , this.getJokes)
 }
 
  async getJokes() {
    let jokes = [];
    while (jokes.length < this.props.numofjokes) {
      let res = await axios.get("https://icanhazdadjoke.com/", {
        headers: { Accept: "application/json" },
      });

      jokes.push({ id: uuidv4(), joke: res.data.joke, vote: 0 });
    }
    this.setState(st => ({
      jokes: [...st.jokes, ...jokes],
      loading: false 
    })
    );
    window.localStorage.setItem("jokes", JSON.stringify(jokes));
  }
  handleVote(id, delta) {
    this.setState((st) => ({
      jokes: st.jokes.map((j) =>
        j.id === id ? { ...j, vote: j.vote + delta } : j
      ),
    }) , 
      () => window.localStorage.setItem("jokes", JSON.stringify(this.state.jokes))
    );
  }

  render() {
    if(this.state.loading){
      return(
        <div className="JokeList-spinner">
        <i class="fas fa-laugh-beam fa-spin fa-5x"></i>
      <h1 className="JokeList-title" style={{color: "#183042"}}>
            Loading...
      </h1>
      </div> 
      )
    }
    return ( 
      <div className="JokeList">
        <div className="JokeList-sidebar">
          <h1 className="JokeList-title">
            <span>Dad</span> Jokes
          </h1>
          <img
            src="https://assets.dryicons.com/uploads/icon/svg/8927/0eb14c71-38f2-433a-bfc8-23d9c99b3647.svg"
            alt="hello"
          />
          <button className="JokeList-getmore" onClick={this.handleClick}>New Jokes</button>
        </div>
        <div className="JokeList-jokes" id="style-10">
          {this.state.jokes.map((j) => {
            return (
              <Joke
                vote={j.vote}
                text={j.joke}
                key={j.id}
                upvote={() => this.handleVote(j.id, 1)}
                downvote={() => this.handleVote(j.id, -1)}
              />
            );
          })}
        </div>
      </div>
    );
  }
}

export default Dadjokes;
