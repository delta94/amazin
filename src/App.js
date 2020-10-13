import React from "react";
import logo from "./logo.svg";
import "./App.css";

function App() {
	const todos = ["Go to market", "Buy food", "Make dinner"];
	const Todos = todos.map((todo) => <li>{todo}</li>);
	return <ul>{Todos}</ul>;
}

export default App;
